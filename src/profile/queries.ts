import {JsonRpcProvider, PublicKey, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {Profile, type as ProfileType} from "./index";

async function getProfile(provider: JsonRpcProvider, address: PublicKey): Promise<Profile> {
    const objectInfos = await provider.getObjectsOwnedByAddress(address.toSuiAddress());
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

export { getProfile };