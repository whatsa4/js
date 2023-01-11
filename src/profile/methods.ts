import {MoveCallTransaction, SuiAddress} from "@mysten/sui.js";
const { packageId } = require('../objects.json');

function registerProfile(gasBudget: number): MoveCallTransaction {
    return {
        packageObjectId: packageId,
        module: 'profile',
        function: 'registerProfile',
        typeArguments: [],
        arguments: [],
        gasBudget,
    }
}

function removeProperties(profile: SuiAddress, keys: [string], gasBudget: number): MoveCallTransaction {
    return {
        packageObjectId: packageId,
        module: 'profile',
        function: 'registerProfile',
        typeArguments: [],
        arguments: [
            keys,
            profile.toString(),
        ],
        gasBudget,
    }
}

function setProperties(profile: SuiAddress, keys: [string], values: [string], gasBudget: number): MoveCallTransaction {
    return {
        packageObjectId: packageId,
        module: 'profile',
        function: 'registerProfile',
        typeArguments: [],
        arguments: [
            keys,
            values,
            profile.toString(),
        ],
        gasBudget,
    }
}

export { registerProfile, setProperties, removeProperties };