import {JsonRpcProvider, Network} from "@mysten/sui.js";
import {getObjects, ProgramObjects, queryForObjects} from "./objects";
import {Domains} from "./domain";
import {Profiles} from "./profile";

class SnsApi {

    provider: JsonRpcProvider;
    objects: ProgramObjects;

    domains: Domains;
    profiles: Profiles;

    constructor(provider: JsonRpcProvider, type: Network, objects: ProgramObjects = null) {
        this.provider = provider;

        if(objects == null) {
            this.objects = getObjects(type);
        } else {
            this.objects = objects;
        }

        this.domains = new Domains(this);
        this.profiles = new Profiles(this);
    }

}

export { SnsApi };