import {Profile} from "./index";
import {SuiAddress} from "@mysten/sui.js";

async function getProfile(domain: string): Promise<Profile> {
    return null;
}

async function getProfileByAddress(address: SuiAddress): Promise<Profile> {
    return null;
}

export { getProfile, getProfileByAddress };