import {MoveCallTransaction} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {
    DeleteDomainRecordsArguments,
    ExtendRegistrationArguments,
    RegisterDomainArguments,
    SetDomainRecordsArguments
} from "./index";
import {getResolver} from "./queries";
import getTableId from "../util/getTableId";


/*
 * Registration
 */

async function registerDomain(
    api: SnsApi,
    args: RegisterDomainArguments
): Promise<MoveCallTransaction> {
    const { objects } = api;
    const { gasBudget } = args;

    const tableId = getTableId(args.name, objects);
    const resolver = await getResolver(api, args.name);

    if(!resolver) {
        return {
            packageObjectId: objects.packageId,
            module: 'domain',
            function: 'registerDomain',
            typeArguments: [],
            arguments: [
                args.name,
                args.tld,
                args.years,
                args.coins,
                objects.timeOracleId,
                objects.treasuryId,
                tableId,
                objects.domainCollectionId
            ],
            gasBudget,
        }
    } else {
        return {
            packageObjectId: objects.packageId,
            module: 'domain',
            function: 'registerExpiredDomain',
            typeArguments: [],
            arguments: [
                args.name,
                args.tld,
                args.years,
                args.coins,
                objects.timeOracleId,
                objects.treasuryId,
                tableId,
                objects.domainCollectionId,
                resolver.id
            ],
            gasBudget
        }
    }
}


async function extendRegistration(
    api: SnsApi,
    args: ExtendRegistrationArguments
): Promise<MoveCallTransaction> {
    const { objects } = api;
    const { gasBudget } = args;

    const resolver = await getResolver(api, args.name);

    return {
        packageObjectId: objects.packageId,
        module: 'domain',
        function: 'extendRegistration',
        typeArguments: [],
        arguments: [
            args.years,
            args.coins,
            resolver.domain,
            resolver.id,
            objects.treasuryId
        ],
        gasBudget,
    }
}


/*
 * Records
 */


function setRecords(
    api: SnsApi,
    args: SetDomainRecordsArguments
): MoveCallTransaction {
    const { objects } = api;
    const { gasBudget } = args;

    return {
        packageObjectId: objects.packageId,
        module: 'domain',
        function: 'setRecords',
        typeArguments: [],
        arguments: [
            args.domain,
            args.resolver,
            args.keys,
            args.values,
            args.TTLs,
        ],
        gasBudget,
    }
}


function deleteRecords(
    api: SnsApi,
    args: DeleteDomainRecordsArguments
): MoveCallTransaction {
    const { objects } = api;
    const { gasBudget } = args;

    return {
        packageObjectId: objects.packageId,
        module: 'domain',
        function: 'deleteRecords',
        typeArguments: [],
        arguments: [
            args.domain,
            args.resolver,
            args.keys,
            args.values,
            args.TTLs,
        ],
        gasBudget,
    }
}


export { registerDomain, extendRegistration, setRecords, deleteRecords }