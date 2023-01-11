import {SuiAddress, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {DomainNFT, Resolver} from "./index";
import getTableId from "../util/getTableId";


async function getResolver(api: SnsApi, domain: string): Promise<Resolver> {
    const { provider, objects } = api;

    const tableId = getTableId(domain, objects);
    const tableObjectResponse = await provider.getObject(tableId);

    if(tableObjectResponse.status !== "NotExists") {
        const tableFields = ((tableObjectResponse.details as SuiObject).data as SuiMoveObject).fields;
        const resolvers = tableFields.resolvers.fields.contents;
        let resolverId = null;

        for (let index in resolvers) {
            let resolver = resolvers[index];
            if (resolver.fields.key === domain.toLowerCase().toString()) {
                resolverId = resolver.fields.value;
            }
        }

        if (resolverId != null) {
            const resolverObjectResponse = await provider.getObject(resolverId);
            const resolverFields = ((resolverObjectResponse.details as SuiObject).data as SuiMoveObject).fields;
            return {
                id: resolverFields.id,
                domain: resolverFields.domain,
                records: resolverFields.records,
                subdomains: resolverFields.subdomains,
                expiration: resolverFields.expiration
            };
        } else {
            return null;
        }
    } else {
        // program not deployed
        return null;
    }
}

async function getDomainNFTByResolver(api: SnsApi, resolver: Resolver): Promise<DomainNFT> {
    const { provider } = api;

    if(resolver) {
        const domainObjectResponse = await provider.getObject(resolver.domain);
        const domainObject = domainObjectResponse.details as SuiObject;

        const domainOwner = domainObject.owner['AddressOwner'];
        const domainFields = (domainObject.data as SuiMoveObject).fields;

        return {
            id: domainFields.id.id,
            collection: domainFields.collection,
            owner: domainOwner.toString(),

            name: domainFields.name,
            tld: domainFields.tld,
            attributes: domainFields.attributes,
            url: domainFields.url,

            expiration: domainFields.expiration,
            timestamp: domainFields.timestamp,
        }
    } else {
        return null;
    }
}
async function getDomainNFT(api: SnsApi, domain: string): Promise<DomainNFT> {
    const resolver = await getResolver(api, domain);
    return await getDomainNFTByResolver(api, resolver);
}

async function getAddress(api: SnsApi, domain: string): Promise<SuiAddress> {
    const nft = await getDomainNFT(api, domain);
    if(nft)
        return nft.owner;
    else
        return null;
}
async function getAddressByResolver(api: SnsApi, resolverId: SuiAddress): Promise<SuiAddress> {
    const { provider } = api;

    const resolverObjectResponse = await provider.getObject(resolverId);

    if(resolverObjectResponse.status == 'Exists') {
        const resolverFields = ((resolverObjectResponse.details as SuiObject).data as SuiMoveObject).fields;
        const resolver = {
            id: resolverFields.id,
            domain: resolverFields.domain,
            records: resolverFields.records,
            subdomains: resolverFields.subdomains,
            expiration: resolverFields.expiration
        };

        const nft = await getDomainNFTByResolver(api, resolver);
        if(nft)
            return nft.owner;
    }

    return null;
}

export { getResolver, getDomainNFT, getAddress, getAddressByResolver };