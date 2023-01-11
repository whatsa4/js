import {JsonRpcProvider, SuiAddress, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {DomainNFT, Resolver} from "./index";
import getTableId from "../util/getTableId";

async function getResolver(provider: JsonRpcProvider, name: string): Promise<Resolver> {
    const tableId = getTableId(name);
    const tableObjectResponse = await provider.getObject(tableId);

    const tableFields = ((tableObjectResponse.details as SuiObject).data as SuiMoveObject).fields;
    const resolvers = tableFields.resolvers.fields.contents;
    let resolverId = null;

    for(let index in resolvers) {
        let resolver = resolvers[index];
        if(resolver.fields.key === name.toLowerCase().toString()) {
            resolverId = resolver.fields.value;
        }
    }

    if(resolverId != null) {
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
}

async function getDomainNFT(provider: JsonRpcProvider, name: string): Promise<DomainNFT> {
    const resolver = await getResolver(provider, name);

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

async function getDomainOwner(provider: JsonRpcProvider, name: string): Promise<SuiAddress> {
    const domain = await getDomainNFT(provider, name);

    if(domain) {
        return domain.owner;
    }

    return null;
}

export { getResolver, getDomainNFT, getDomainOwner };