import {JsonRpcProvider, Network} from "@mysten/sui.js";
import {getObjects, ProgramObjects, queryForObjects} from "./objects";
import {Domains} from "./domain";
import {Profiles} from "./profile";

class SnsApi {

    provider: JsonRpcProvider;
    programObjects: ProgramObjects;

    domains: Domains;
    profiles: Profiles;

    constructor(provider: JsonRpcProvider, type: Network, programObjects: ProgramObjects = null) {
        this.provider = provider;

        if(programObjects == null) {
            this.programObjects = getObjects(type);
        } else {
            this.programObjects = programObjects;
        }

        this.domains = new Domains(this);
        this.profiles = new Profiles(this);
    }

}

export { SnsApi };