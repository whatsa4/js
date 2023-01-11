import {step} from "mocha-steps";
import {Ed25519Keypair, JsonRpcProvider, Network, RawSigner} from "@mysten/sui.js";
const nacl = require('tweetnacl');

import * as assert from "assert";
import {getDomainNFT, getResolver} from "../dist";

describe("Sui Name Service - api tests", async () => {
    // make random key
    const secretKey = Uint8Array.from(JSON.parse(process.env.DOMAINS_TEST_SECRET_KEY)) || nacl.sign.keyPair().secretKey;
    const fundAccount = false;

    // console.log('Secret key: [', secretKey.toString(), ']');
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const provider = new JsonRpcProvider(Network.DEVNET);

    const signer = new RawSigner(keypair, provider);
    const domain_name = "anthony";


    if(fundAccount) {
        step("fund account", async function () {
            const response = await signer.requestSuiFromFaucet();
            assert.equal(response.error, null);
        });
    }

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
