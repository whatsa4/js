import {ObjectId} from "@mysten/sui.js";
import {ProgramObjects} from "../objects";

function getTableId(name: string, objects: ProgramObjects): ObjectId {
    const { sortedDomainTableIds } = objects;
    name = name.split('.')[0];
    let hashCode = 0;

    for(let i = 0; i < name.length; i++) {
        const c = name.charCodeAt(i);
        hashCode = 37 * c + hashCode;
    }

    let index = hashCode % sortedDomainTableIds.length;
    return sortedDomainTableIds[index];
}

export default getTableId;