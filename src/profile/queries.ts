import {SuiAddress, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {SnsApi} from "../api";
import {Profile, getType} from "./index";
import {DomainNFT} from "../domain";


async function getProfile(api: SnsApi, userAddress: SuiAddress): Promise<Profile> {
    const { provider, objects } = api;
    const ProfileType = getType(objects.packageId);

    const objectInfos = await provider.getObjectsOwnedByAddress(userAddress);
    let profile = null;

    for(let objectIndex in objectInfos) {
        const objectInfo = objectInfos[objectIndex];

        if(objectInfo.type == ProfileType) {
            let object = await provider.getObject(objectInfo.objectId);
            let objectFields = ((object.details as SuiObject).data as SuiMoveObject).fields;

            if(objectFields.owner == userAddress) {
                profile = {
                    id: objectFields.id,
                    owner: objectFields.owner,

                    name: objectFields.name,
                    url: objectFields.url,

                    primary: objectFields.primary,
                    keys: objectFields.keys,
                    values: objectFields.values,
                    timestamp: objectFields.timestamp,
                };

                break;
            }
        }
    }

    return profile;
}

async function getPrimaryDomain(api: SnsApi, address: SuiAddress): Promise<DomainNFT> {
    const profile = await getProfile(api, address);

    if(profile != null) {
        const domainId = profile.primary;

        if(domainId) {
            return await api.domains.getDomainNFTById(domainId);
        }
    }
    return null;
}

export { getProfile, getPrimaryDomain };