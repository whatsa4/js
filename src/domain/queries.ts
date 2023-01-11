import {DomainNFT, DomainResolver, getDomainNftType} from "./index";
import {SnsApi} from "../api";
import {SuiAddress, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import axios from 'axios';


async function getResolver(api: SnsApi, domain: string): Promise<DomainResolver> {
    const url = api.provider.endpoints.fullNode;
    const { domainRegistryId } = api.programObjects;

    // in case passed as .sui
    domain = domain.split('.sui')[0];

    // sui_getObjectFieldName must have a name that matches the wrapper
    // the method does not automatically convert strings to their u8 vector equivalent
    // like with move function calls
    let encoder = new TextEncoder();
    let domain_bytes_vector = encoder.encode(domain);
    let domain_bytes_str = [];

    for(let domain_byte of domain_bytes_vector) {
        domain_bytes_str.push(`${domain_byte}u8`);
    }

    let domain_field_name = `vector[${domain_bytes_str.join(', ')}]`;

    try {
        const response = await axios.post(url,{
            jsonrpc: "2.0",
            id: 1,
            method: "sui_getDynamicFieldObject",
            params: [domainRegistryId, domain_field_name]
        });

        const result = response.data;

        if(!result.error) {
            const fields = result.result.details.data.fields;
            const records = [];

            for(let unparsedRecord of fields.records) {
                const parsedRecord = {
                    type: unparsedRecord.type,
                    key: unparsedRecord.key,
                    value: unparsedRecord.value,
                    ttl: unparsedRecord.ttl,
                };

                records.push(parsedRecord);
            }

            return {
                id: fields.id.id,
                domain_nft: fields.domain_nft,
                records: fields.records,
                expiration: fields.expiration
            }
        } else {
            return null;
        }
    } catch(e) {
        console.log('ERROR: domains:queries:getResolver(', domain, ') -', e);
        return null;
    }
}

async function getAddress(api: SnsApi, domain: string): Promise<SuiAddress> {
    const { provider } = api;
    const resolver = await getResolver(api, domain);

    if(resolver) {
        const nftId = resolver.domain_nft;
        const objectResponse = await provider.getObject(nftId);

        if (objectResponse.status === "Exists") {
            const objectDetails = (objectResponse.details as SuiObject);
            return objectDetails.owner['ObjectOwner'];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

async function getDomain(api: SnsApi, domain: string): Promise<DomainNFT> {
    const { provider } = api;
    const resolver = await getResolver(api, domain);

    if(resolver) {
        const nftId = resolver.domain_nft;
        const objectResponse = await provider.getObject(nftId);

        if(objectResponse.status === "Exists") {
            const object = ((objectResponse.details as SuiObject).data as SuiMoveObject).fields;
            const objectAttributes = object.attributes.fields;

            let attributes_keys = [];
            let attributes_values = [];

            for(let i = 0; i < objectAttributes.keys.length; i++) {
                attributes_keys.push(objectAttributes.keys[i]);
                attributes_values.push(objectAttributes.values[i]);
            }

            return {
                id: object['id'],
                collection: object['collection'],
                owner: object['owner'],

                domain_name: object['domain_name'],
                domain_tld: object['domain_tld'],

                name: object['name'],
                attributes: {
                    keys: attributes_keys as [string],
                    values: attributes_values as [string],
                },
                url: object['url'],

                expiration: Number(object['expiration']),
                timestamp: Number(object['timestamp'])
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
}

async function getDomains(api: SnsApi, address: SuiAddress): Promise<DomainNFT[]> {
    const { provider, programObjects } = api;

    const objects = await provider.getObjectsOwnedByAddress(address);
    const domainNftType = getDomainNftType(programObjects.packageId);
    const domainObjectIds = objects.filter((object) => object.type === domainNftType).map((object) => object.objectId);

    if(domainObjectIds.length === 0) {
        return [];
    }

    // fetch objects
    const domainObjects = await provider.getObjectBatch(domainObjectIds);
    let validResponses = domainObjects.filter((objectResponse) => objectResponse.status === 'Exists');

    // parse NFTs
    return validResponses.map((objectResponse) => {
        const object = (objectResponse.details as SuiObject).data as SuiMoveObject;

        return {
            id: object['id'],
            collection: object['collection'],
            owner: object['owner'],

            domain_name: object['domain_name'],
            domain_tld: object['domain_tld'],

            name: object['name'],
            attributes: object['attributes'],
            url: object['url'],

            expiration: object['expiration'],
            timestamp: object['timestamp']
        }
    });
}

export { getResolver, getAddress, getDomain, getDomains };