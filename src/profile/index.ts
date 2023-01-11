import {MoveCallTransaction, PublicKey, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {getProfile} from "./queries";
import {registerProfile, setProperties, removeProperties} from "./methods";

/*
 * Interfaces
 */

export interface Profile {
    id: string,
    owner: string,
    url: string,
    primary?: string,
    properties: [string: string],
}
export const getType = (packageId) => `${packageId}::profile::Profile`;

/*
 * Arguments
 */

export interface RegisterProfileArguments {
    gasBudget: number
}
export interface RemovePropertiesArguments {
    profile: SuiAddress,
    keys: [string],
    gasBudget: number
}
export interface SetPropertiesArguments {
    profile: SuiAddress,
    keys: [string],
    values: [string],
    gasBudget: number
}

/*
 * Wrapper
 */

export class Profiles {

    api: SnsApi;

    constructor(api: SnsApi) {
        this.api = api;
    }

    /*
     * Queries
     */

    async getProfile(address: SuiAddress): Promise<Profile> {
        return await getProfile(this.api, address);
    }

    /*
     * Methods
     */

    registerProfile(args: RegisterProfileArguments): MoveCallTransaction {
        return registerProfile(this.api, args);
    };
    setProperties(args: SetPropertiesArguments): MoveCallTransaction {
        return setProperties(this.api, args);
    };
    removeProperties(args: RemovePropertiesArguments): MoveCallTransaction {
        return removeProperties(this.api, args);
    };
}