import {JsonRpcProvider, MoveCallTransaction, ObjectId, PublicKey} from "@mysten/sui.js";
const { packageId, timeOracleId, treasuryId, domainCollectionId } = require('../objects.json');
import getTableId from "../util/getTableId";
import { getResolver } from "./queries";


/*
 * Registration
 */

async function registerDomain(
    provider: JsonRpcProvider,
    sender: PublicKey,
    name: string,
    tld: string,
    years: number,
    coins: ObjectId,
    gasBudget: number
): Promise<MoveCallTransaction> {
    const tableId = getTableId(name);
    const resolver = await getResolver(provider, name);

    if(!resolver) {
        return {
            packageObjectId: packageId,
            module: 'domain',
            function: 'registerDomain',
            typeArguments: [],
            arguments: [
                name,
                tld,
                years,
                coins,
                timeOracleId,
                treasuryId,
                tableId,
                domainCollectionId
            ],
            gasBudget,
        }
    } else {
        return {
            packageObjectId: packageId,
            module: 'domain',
            function: 'registerExpiredDomain',
            typeArguments: [],
            arguments: [
                name,
                tld,
                years,
                coins,
                timeOracleId,
                treasuryId,
                tableId,
                domainCollectionId,
                resolver.id
            ],
            gasBudget
        }
    }
}


async function extendRegistration(
    provider: JsonRpcProvider,
    name: string,
    years: number,
    coins: ObjectId,
    gasBudget: number
) {
    const resolver = await getResolver(provider, name);

    return {
        packageObjectId: packageId,
        module: 'domain',
        function: 'extendRegistration',
        typeArguments: [],
        arguments: [
            years,
            coins,
            resolver.domain,
            resolver.id,
            treasuryId
        ],
        gasBudget,
    }
}


/*
 * Records
 */


function setRecords(
    domain: ObjectId,
    resolver: ObjectId,
    keys: [string],
    values: [string],
    TTLs: [number],
    gasBudget: number,
): MoveCallTransaction {
    return {
        packageObjectId: packageId,
        module: 'domain',
        function: 'setRecords',
        typeArguments: [],
        arguments: [
            domain,
            resolver,
            keys,
            values,
            TTLs,
        ],
        gasBudget,
    }
}


function deleteRecords(
    domain: ObjectId,
    resolver: ObjectId,
    keys: [string],
    values: [string],
    TTLs: [number],
    gasBudget: number,
): MoveCallTransaction {
    return {
        packageObjectId: packageId,
        module: 'domain',
        function: 'deleteRecords',
        typeArguments: [],
        arguments: [
            domain,
            resolver,
            keys,
            values,
            TTLs,
        ],
        gasBudget,
    }
}



export { registerDomain, extendRegistration, setRecords, deleteRecords }