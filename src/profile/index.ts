import {MoveCallTransaction, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {registerProfile, updateProfile} from "./methods";

/*
 * Interfaces
 */

export interface Profile {
    id: SuiAddress,

    name: string,
    description: string,
    image: string,

    primary?: SuiAddress,
    records: {string: string},

    timestamp: number,
}
export const getType = (packageId) => `${packageId}::domain::Profile`;

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

    async getProfile(domain: string): Promise<Profile> {
        return null;
    }
    async getProfileByAddress(address: SuiAddress): Promise<Profile> {
        return null;
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