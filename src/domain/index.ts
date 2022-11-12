export interface ResolverRecord {
    value: string,
    ttl: number,
}

export interface Resolver {
    id: string,
    domain: string,
    records: {string: ResolverRecord},
    subdomains?: string,
    expiration: number
}

export interface Domain {
    id: string,
    collection: string,
    owner: string,

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