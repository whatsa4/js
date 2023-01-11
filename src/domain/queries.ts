import {DomainNFT, DomainResolver, getDomainNftType} from "./index";
import {SnsApi} from "../api";
import {SuiAddress, SuiMoveObject, SuiObject} from "@mysten/sui.js";


async function getResolver(api: SnsApi, domain: string): Promise<DomainResolver> {
    return null;
}

async function getAddress(api: SnsApi, domain: string): Promise<SuiAddress> {
    return null;
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

export { getResolver, getAddress, getDomains };