import {Network, SuiAddress} from "@mysten/sui.js";
import axios from "axios";
const DEVNET_OBJECTS = require('../objects/devnet.json');

const OBJECTS_URL = "https://raw.githubusercontent.com/snsdomains/objects.json/master/";

interface ProgramObjects {
    packageId: SuiAddress,
    adminId: SuiAddress,
    sortedDomainTableIds: [SuiAddress],
    domainCollectionId: SuiAddress,
    treasuryId: SuiAddress,
    timeOracleId: SuiAddress,
}
function getObjects(type: Network): ProgramObjects {
    if(type == Network.DEVNET) {
        return DEVNET_OBJECTS;
    }

    return null;
}

async function queryForObjects(type: Network): Promise<ProgramObjects> {
    let url = OBJECTS_URL;

    if(type == Network.DEVNET) {
        url += 'devnet.json';

        const response = await axios.get(url);
        return response.data;
    } else {
        return null;
    }
}


export { getObjects, queryForObjects, ProgramObjects };