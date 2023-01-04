import {MoveCallTransaction, ObjectId, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {getResolver, getDomainNFT, getAddress, getAddressByResolver, getDomainNFTById} from "./queries";
import {registerDomain, extendRegistration, deleteRecords, setRecords} from "./methods";

/*
 * Interfaces
 */

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
    attributes: {
        keys: [string],
        values: [string]
    },
    url: string,

    expiration: number,
    timestamp: number,
}

/*
 * Arguments
 */

export interface RegisterDomainArguments {
    sender: SuiAddress,

    name: string,
    tld: string,
    years: number,
    coins: ObjectId,

    gasBudget: number
}
export interface ExtendRegistrationArguments {
    name: string,
    years: number,
    coins: ObjectId,
    createProfile: boolean,
    gasBudget: number
}
export interface SetDomainRecordsArguments {
    domain: ObjectId,
    resolver: ObjectId,
    keys: [string],
    values: [string],
    TTLs: [number],
    gasBudget: number,
}
export interface DeleteDomainRecordsArguments {
    domain: ObjectId,
    resolver: ObjectId,
    keys: [string],
    values: [string],
    TTLs: [number],
    gasBudget: number,
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

    async getResolver(domain: string): Promise<Resolver> {
        return await getResolver(this.api, domain);
    };
    async getDomainNFT(domain: string): Promise<DomainNFT> {
        return await getDomainNFT(this.api, domain);
    };
    async getDomainNFTById(id: SuiAddress): Promise<DomainNFT> {
        return getDomainNFTById(this.api, id);
    }
    async getAddress(domain: string): Promise<SuiAddress> {
        return await getAddress(this.api, domain);
    };
    async getAddressByResolver(resolverId: string): Promise<SuiAddress> {
        return getAddressByResolver(this.api, resolverId);
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
    deleteRecords(args: DeleteDomainRecordsArguments): MoveCallTransaction {
        return deleteRecords(this.api, args);
    };
    setRecords(args: SetDomainRecordsArguments): MoveCallTransaction {
        return setRecords(this.api, args);
    };
}