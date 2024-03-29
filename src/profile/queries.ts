import {Profile} from "./index";
import {SuiAddress} from "@mysten/sui.js";
import axios from "axios";
import {SnsApi} from "../api";
import {DomainNFT} from "../domain";
import parseDomainObjectResponse from "../util";

async function getProfile(api: SnsApi, address: SuiAddress): Promise<Profile> {
    const url = api.provider.endpoints.fullNode;
    const { profileRegistryId } = api.programObjects;
    let stringAddress = address.toString();

    if(!address.startsWith("0x")) {
        stringAddress = '0x' + address;
    }

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "sui_getDynamicFieldObject",
            params: [profileRegistryId, stringAddress]
        });

        const result = response.data;

        if(!result.error) {
            const fields = result.result.details.data.fields;
            const fieldRecords = fields.records.fields.contents;
            const parsedRecords = {};

            for(let i = 0; i < fieldRecords.length; i++) {
                const record = fieldRecords[i].fields;
                parsedRecords[record.key] = record.value;
            }

            return {
                id: fields.id['id'],
                name: fields.name,
                bio: fields.bio,
                image: fields.image,
                primary: fields.primary ? fields.primary : null,
                records: parsedRecords as {string: string},
                timestamp: Number(fields.timestamp),
            };
        } else {
            return null;
        }
    } catch(e) {
        console.log('ERROR: profile:queries:getProfile(', address.toString(), ') -', e);
        return null;
    }
}

async function getPrimaryDomain(api: SnsApi, profile: Profile): Promise<DomainNFT> {
    const { provider } = api;
    const nftAddress = profile.primary;

    if(nftAddress) {
        const domainNftResponse = await provider.getObject(nftAddress);
        return parseDomainObjectResponse(domainNftResponse);
    } else {
        return null;
    }
}

export { getProfile, getPrimaryDomain };