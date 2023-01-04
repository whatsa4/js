import {MoveCallTransaction} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {RegisterProfileArguments, UpdateProfileArguments} from "./index";


function registerProfile(api: SnsApi, args: RegisterProfileArguments): MoveCallTransaction {
    const { objects } = api;
    return {
        packageObjectId: objects.packageId,
        module: 'domain',
        function: 'updateProfile',
        typeArguments: [],
        arguments: [
            objects.timeOracleId
        ],
        gasBudget: args.gasBudget,
    };
}
function updateProfile(api: SnsApi, args: UpdateProfileArguments): MoveCallTransaction {
    const {objects} = api;
    return {
        packageObjectId: objects.packageId,
        module: 'domain',
        function: 'updateProfile',
        typeArguments: [],
        arguments: [
            args.profile.toString(),

            args.name,
            args.url,
            args.primary,
            args.keys,
            args.values
        ],
        gasBudget: args.gasBudget,
    };
}


export { registerProfile, updateProfile };