import {SuiAddress} from "@mysten/sui.js";

export interface ResolverRecord {
    value: string,
    ttl: number,
}

export interface Resolver {
    id: SuiAddress,
    domain: SuiAddress,
    records: {string: ResolverRecord},
    subdomains?: string,
    expiration: number
}

export interface DomainNFT {
    id: SuiAddress,
    collection: SuiAddress,
    owner: SuiAddress,

    name: string,
    tld: string,
    attributes: {
        keys: [string],
        values: [string]
    },
    url: string,

    expiration: number,
    timestamp: number,
}