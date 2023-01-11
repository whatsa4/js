import {ObjectId} from "@mysten/sui.js";
const { sortedDomainTableIds } = require('../objects.json');

function getTableId(name: string): ObjectId {
    let hashCode = 0;

    for(let i = 0; i < name.length; i++) {
        const c = name.charCodeAt(i);
        hashCode = 37 * c + hashCode;
    }

    let index = hashCode % sortedDomainTableIds.length;
    return sortedDomainTableIds[index];
}

export default getTableId;