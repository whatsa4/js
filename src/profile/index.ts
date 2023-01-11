import {MoveCallTransaction, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {registerProfile, updateProfile} from "./methods";
import {getProfile} from "./queries";

/*
 * Interfaces
 */

export interface Profile {
    id: SuiAddress,

    name: string,
    bio: string,
    image: string,

    primary?: SuiAddress,
    records: {string: string},

    timestamp: number,
}

/*
 * Arguments
 */

export interface RegisterProfileArguments {
    gasBudget?: number
}
export interface UpdateProfileArguments {
    name?: string,
    description?: string,
    keys?: [string],
    values?: [string],
    primary?: SuiAddress,

    gasBudget?: number,
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

    async getProfile(userAddress: SuiAddress): Promise<Profile> {
        return getProfile(this.api, userAddress);
    }

    /*
     * Methods
     */

    registerProfile(args: RegisterProfileArguments): MoveCallTransaction {
        return registerProfile(this.api, args);
    };
    updateProfile(args: UpdateProfileArguments): MoveCallTransaction {
        return updateProfile(this.api, args);
    };
}