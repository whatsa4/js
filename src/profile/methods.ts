import {MoveCallTransaction, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {RegisterProfileArguments, RemovePropertiesArguments, SetPropertiesArguments} from "./index";


function registerProfile(api: SnsApi, args: RegisterProfileArguments): MoveCallTransaction {
    const { objects } = api;
    return {
        packageObjectId: objects.packageId,
        module: 'profile',
        function: 'registerProfile',
        typeArguments: [],
        arguments: [],
        gasBudget: args.gasBudget,
    };
}
function setProperties(api: SnsApi, args: SetPropertiesArguments): MoveCallTransaction {
    const { objects } = api;
    return {
        packageObjectId: objects.packageId,
        module: 'profile',
        function: 'registerProfile',
        typeArguments: [],
        arguments: [
            args.keys,
            args.values,
            args.profile.toString(),
        ],
        gasBudget: args.gasBudget,
    };
}
function removeProperties(api: SnsApi, args: RemovePropertiesArguments): MoveCallTransaction {
    const { objects } = api;
    return {
        packageObjectId: objects.packageId,
        module: 'profile',
        function: 'registerProfile',
        typeArguments: [],
        arguments: [
            args.keys,
            args.profile.toString(),
        ],
        gasBudget: args.gasBudget,
    };
}


export { registerProfile, setProperties, removeProperties };