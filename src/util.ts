import {GetObjectDataResponse, SuiMoveObject, SuiObject} from "@mysten/sui.js";
import {DomainNFT} from "./domain";

function parseDomainObjectResponse(objectResponse: GetObjectDataResponse): DomainNFT {
    if(objectResponse.status === "Exists") {
        const objectDetails = (objectResponse.details as SuiObject);
        const object = (objectDetails.data as SuiMoveObject).fields;
        const objectAttributes = object.attributes.fields;

        let attributes_keys = [];
        let attributes_values = [];

        for (let i = 0; i < objectAttributes.keys.length; i++) {
            attributes_keys.push(objectAttributes.keys[i]);
            attributes_values.push(objectAttributes.values[i]);
        }

        return {
            id: object.id['id'],
            collection: object['collection'],
            owner: objectDetails.owner['AddressOwner'],

            domain_name: object['domain_name'],
            domain_tld: object['domain_tld'],

            name: object['name'],
            attributes: {
                keys: attributes_keys as [string],
                values: attributes_values as [string],
            },
            url: object['url'],

            expiration: Number(object['expiration']),
            timestamp: Number(object['timestamp'])
        };
    } else {
        return null;
    }
}

export default parseDomainObjectResponse;
