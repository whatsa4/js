import {MoveCallTransaction, SuiAddress} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {getPrimaryDomain, getProfile} from "./queries";
import {registerProfile, updateProfile} from "./methods";
import {DomainNFT} from "../domain";

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
export const getType = (packageId) => `${packageId}::domain::Profile`;

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
export interface UpdateProfileArguments {
    profile: SuiAddress,

    name: string,
    url: string,
    primary?: SuiAddress,
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
    async getPrimaryDomain(profileAddress: SuiAddress): Promise<DomainNFT> {
        return await getPrimaryDomain(this.api, profileAddress);
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