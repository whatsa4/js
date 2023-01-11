import {JsonRpcProvider, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {Domain, Resolver} from "./index";
import getTableId from "../util/getTableId";

async function getDomain(provider: JsonRpcProvider, name: string): Promise<Domain> {
    const resolver = await getResolver(provider, name);
    if(resolver) {
        const domainObjectResponse = await provider.getObject(resolver.domain);
        const domainObject = domainObjectResponse.details as SuiObject;

        const domainOwner = domainObject['AddressOwner'];
        const domainFields = (domainObject.data as SuiMoveObject).fields;

        return {
            id: domainFields.id,
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

async function getResolver(provider: JsonRpcProvider, name: string): Promise<Resolver> {
    const tableId = getTableId(name);
    const tableObjectResponse = await provider.getObject(tableId);
    const tableFields = ((tableObjectResponse.details as SuiObject).data as SuiMoveObject).fields;
    const resolvers = tableFields.resolvers;

    const resolverId = resolvers[name.toLowerCase()];

    if(resolverId) {
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

export { getDomain, getResolver };