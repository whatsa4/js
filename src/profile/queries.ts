import {PublicKey, SuiAddress, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {Profile, getType} from "./index";


async function getProfile(api: SnsApi, address: SuiAddress): Promise<Profile> {
    const { provider, objects } = api;
    const ProfileType = getType(objects.packageId);

    const objectInfos = await provider.getObjectsOwnedByAddress(address);
    let profile = null;

    for(let objectIndex in objectInfos) {
        const objectInfo = objectInfos[objectIndex];

        if(objectInfo.type == ProfileType) {
            let object = await provider.getObject(objectInfo.objectId);
            let objectFields = ((object.details as SuiObject).data as SuiMoveObject).fields;

            profile = {
                id: objectFields.id,
                owner: objectFields.owner,
                url: objectFields.url,
                primary: objectFields.primary,
                properties: objectFields.properties
            };

            break;
        }
    }

    return profile;
}

async function getPrimaryDomain(api: SnsApi, address: SuiAddress): Promise<Profile> {
    const profile = await getProfile(api, address);

    if(profile != null) {
        const domainId = profile.primary;

        if(domainId) {

        }
    }
    return null;
}

export { getProfile };