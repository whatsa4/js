import {step} from "mocha-steps";
import {JsonRpcProvider, Network, RawSigner} from "@mysten/sui.js";
const nacl = require('tweetnacl');

import * as assert from "assert";
import {getDomainNFT, getResolver} from "../src";
import {timeOracleId} from "../src/objects.json";

describe("Sui Name Service - query api tests", async () => {
    // make random key
    const fundAccount = false;

    const keypair = nacl.sign.keyPair().secretKey;
    const provider = new JsonRpcProvider(Network.DEVNET);

    const signer = new RawSigner(keypair, provider);
    const domain_name = "anthony";

    if(fundAccount) {
        step("fund account", async function () {
            const response = await signer.requestSuiFromFaucet();
            assert.equal(response.error, null);
        });
    }

    it("program - deployed", async function() {
        const timeOracleQueryResponse = await provider.getObject(timeOracleId);
        assert.equal(timeOracleQueryResponse.status, 'Exists', 'program not deployed or old objects.json');
    });

    describe("domains - queries", async function() {
        step("getResolver", async function() {
            const resolver = await getResolver(provider, domain_name);
            assert.equal(resolver, null);
        });

        step("getDomain", async function() {
            const domain = await getDomainNFT(provider, domain_name);
            assert.equal(domain, null);
        });
    });

});
