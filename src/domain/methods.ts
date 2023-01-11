import {MoveCallTransaction} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {
    ExtendRegistrationArguments,
    RegisterDomainArguments,
    SetDomainRecordsArguments
} from "./index";


/*
 * Registration
 */

async function registerDomain(
    api: SnsApi,
    args: RegisterDomainArguments
): Promise<MoveCallTransaction> {
    const { programObjects } = api;
    return {
        packageObjectId: programObjects.packageId,
        module: 'domain',
        function: 'registerDomain',
        typeArguments: [],
        arguments: [
            args.name,
            args.tld,
            args.years,
            args.fee,

            programObjects.domainRegistryId,
            programObjects.profileRegistryId
        ],
        gasBudget: args.gasBudget || 20_000
    }
}


async function extendRegistration(
    api: SnsApi,
    args: ExtendRegistrationArguments
): Promise<MoveCallTransaction> {
    const { programObjects } = api;

    return {
        packageObjectId: programObjects.packageId,
        module: 'domain',
        function: 'extendRegistration',
        typeArguments: [],
        arguments: [
            args.domain_nft,
            args.years,
            args.fee,

            programObjects.domainRegistryId
        ],
        gasBudget: args.gasBudget || 20_000
    }
}


/*
 * Records
 */


function setRecords(
    api: SnsApi,
    args: SetDomainRecordsArguments
): MoveCallTransaction {
    const { programObjects } = api;

    return {
        packageObjectId: programObjects.packageId,
        module: 'domain',
        function: 'setRecords',
        typeArguments: [],
        arguments: [
            args.domain_nft,
            args.keys,
            args.values,
            args.ttls,

            programObjects.domainRegistryId
        ],
        gasBudget: args.gasBudget || 20_000,
    }
}



export { registerDomain, extendRegistration, setRecords }