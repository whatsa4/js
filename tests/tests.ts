import {step} from "mocha-steps";
import {JsonRpcProvider, Network, RawSigner} from "@mysten/sui.js";
import * as assert from "assert";
import {SnsApi} from "../src";
import {getObjects, queryForObjects} from "../src/objects";

const nacl = require('tweetnacl');

describe("Sui Name Service - query api tests", async () => {
    // make random key
    const fundAccount = false;

    const keypair = nacl.sign.keyPair().secretKey;
    const rpc = new JsonRpcProvider(Network.DEVNET);
    let api = new SnsApi(rpc, Network.DEVNET);

    const signer = new RawSigner(keypair, api.provider);
    const domain_name = "anthony";

    if(fundAccount) {
        step("fund account", async function () {
            const response = await signer.requestSuiFromFaucet();
            assert.equal(response.error, null);
        });
    }

    it("program - deployed", async function() {
        const timeOracleId = getObjects(Network.DEVNET).timeOracleId;
        const timeOracleQueryResponse = await rpc.getObject(timeOracleId);
        assert.equal(timeOracleQueryResponse.status, 'Exists', 'program not deployed or old objects.json');
    });

    it("api - query 'objects.json'", async function() {
        const objects = await queryForObjects(Network.DEVNET);
        assert.notEqual(objects.packageId, null, 'PackageID from github null');
    });

    describe("domains - queries", async function() {
        step("getResolver", async function() {
            const resolver = await api.domains.getResolver(domain_name);
            assert.equal(resolver, null);
        });

        step("getDomain", async function() {
            const domain = await api.domains.getDomainNFT(domain_name);
            assert.equal(domain, null);
        });
    });

});
