import {MoveCallTransaction, ObjectId, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {getResolver, getAddress, getDomains} from "./queries";
import {registerDomain, extendRegistration, setRecords} from "./methods";

/*
 * Interfaces
 */

export interface DomainNFT {
    id: SuiAddress,
    collection: SuiAddress,
    owner: SuiAddress,

    // domain-specific
    domain_name: string,
    domain_tld: string,

    // nft-related
    name: string,
    attributes: {
        keys: [string],
        values: [string]
    },
    url: string,

    expiration: number,
    timestamp: number,
}
export interface ResolverRecord {

    value: string,
    ttl: number
}
export interface DomainResolver {
    id: SuiAddress,
    domain_nft: SuiAddress,
    records: [ResolverRecord],
    expiration: number
}

export const getDomainNftType = (packageId) => `${packageId}::domain::DomainNft`;

/*
 * Arguments
 */

export interface RegisterDomainArguments {
    name: string,
    tld: string,
    years: number,
    fee: ObjectId,

    gasBudget?: number,
}
export interface ExtendRegistrationArguments {
    domain_nft: ObjectId,
    years: number,
    fee: ObjectId,

    gasBudget?: number,
}
export interface SetDomainRecordsArguments {
    domain_nft: ObjectId,
    keys: [string],
    values: [string],
    ttls: [number],

    gasBudget?: number,
}
export interface DeleteDomainRecordsArguments {
    domain_nft: ObjectId,
    keys: [string],

    gasBudget?: number,
}

/*
 * Wrapper
 */

export class Domains {

    api: SnsApi;

    constructor(api: SnsApi) {
        this.api = api;
    };

    /*
     * Queries
     */

    async getResolver(domain: string): Promise<DomainResolver> {
        return getResolver(this.api, domain);
    }
    async getAddress(domain: string): Promise<SuiAddress> {
        return getAddress(this.api, domain);
    }
    async getDomains(address: SuiAddress): Promise<DomainNFT[]> {
        return getDomains(this.api, address);
    }

    /*
     * Methods
     */

    async registerDomain(args: RegisterDomainArguments): Promise<MoveCallTransaction> {
        return await registerDomain(this.api, args);
    };
    async extendRegistration(args: ExtendRegistrationArguments): Promise<MoveCallTransaction> {
        return await extendRegistration(this.api, args);
    };
    setRecords(args: SetDomainRecordsArguments): MoveCallTransaction {
        return setRecords(this.api, args);
    };

}