import {step} from "mocha-steps";
import {
    Coin,
    Ed25519Keypair,
    JsonRpcProvider,
    Network,
    RawSigner,
} from "@mysten/sui.js";
import * as assert from "assert";
import {SnsApi} from "../src";
import {getObjects, queryForObjects} from "../src/objects";

const nacl = require('tweetnacl');

/*
 * On deploy testing: a new address is created & used to make a domain
 * this domain / address is used to test whether the test cases work.
 * Because this is only done on deploys, it doesn't matter if the public
 * key is leaked. We manually test before publishing anyway.
 */

describe("Sui Name Service - query api tests", async () => {
    // make random key
    const testMethods = false;
    const domainCreated = true;

    // const keypair = nacl.sign.keyPair();
    const testKeyPair = Ed25519Keypair.fromSecretKey(Uint8Array.from([29,6,29,39,71,104,9,79,90,58,15,57,74,167,166,132,113,216,145,231,37,66,44,43,86,52,195,6,153,159,228,90,147,24,215,79,59,199,22,236,31,29,197,92,136,209,243,2,22,194,119,35,75,65,169,41,248,161,217,114,219,81,19,191]));
    const provider = new JsonRpcProvider(Network.DEVNET);
    let api = new SnsApi(provider, Network.DEVNET);

    const signer = new RawSigner(testKeyPair, api.provider);
    // const domain_name = crypto.randomBytes(12).toString('hex');
    const domain_name = "testertester3";

    it("program - deployed", async function() {
        const collectionId = getObjects(Network.DEVNET).domainCollectionId;
        const timeOracleQueryResponse = await provider.getObject(collectionId);
        assert.equal(timeOracleQueryResponse.status, 'Exists', 'program not deployed or old objects.json');
    });

    if(testMethods) {
        describe("domains - methods", async function() {
            // step("fund account", async function () {
            //     const suiAddress = await signer.getAddress();
            //     console.log('signer address', suiAddress);
            //
            //     const response = await signer.requestSuiFromFaucet();
            //     assert.equal(response.error, null);
            // });

            step("registerDomain", async function() {
                const signerAddress = await signer.getAddress();
                let coinIds = await provider.getGasObjectsOwnedByAddress(signerAddress);
                let coins = await provider.getObjectBatch(coinIds.map((coinId) => coinId.objectId));
                // sort from greatest to least - descending order
                coins = coins.sort((coin1, coin2) => Coin.getBalance(coin1) > Coin.getBalance(coin2) ? -1 : 1);

                const coinId = coins[0].details['data']['fields']['id']['id'];

                const domainTx = await api.domains.registerDomain({
                    name: domain_name,
                    tld: "sui",
                    years: 1,
                    fee: coinId
                });

                const response = await signer.executeMoveCall(domainTx);
                console.log(JSON.stringify(response['EffectsCert']['effects']['effects']));

                assert.equal(response['EffectsCert']['effects']['effects']['status']['status'], 'success', response.toString());
            });
        });
    }

    it("api - query 'objects.json'", async function() {
        const objects = await queryForObjects(Network.DEVNET);
        assert.notEqual(objects.packageId, null, 'PackageID from github null');
    });

    describe("domains - queries", async function() {
        step("domain::getResolver", async function() {
            const resolver = await api.domains.getResolver(domain_name);

            if(testMethods || domainCreated) {
                assert.notEqual(resolver, null);
            } else {
                assert.equal(resolver, null);
            }
        });

        step("domain::getDomain", async function() {
            const domain = await api.domains.getDomain(domain_name);

            if(testMethods || domainCreated) {
                assert.notEqual(domain, null);
            } else {
                assert.equal(domain, null);
            }
        });

        step("domain::getAddress", async function() {
            const address = await signer.getAddress();
            const ownerAddress = await api.domains.getAddress(domain_name);

            if(testMethods || domainCreated) {
                assert.equal(ownerAddress, `0x${address}`);
            } else {
                assert.equal(ownerAddress, null);
            }
        });

        step("domain::getDomains", async function() {
            const address = await signer.getAddress();
            const domains = await api.domains.getDomains(address);

            if(testMethods || domainCreated) {
                assert.ok(domains.length >= 1);
                assert.ok(domains[0].domain_name === domain_name);
            } else {
                assert.equal(domains, []);
            }
        });

        step("profile::getProfile", async function() {
            const address = await signer.getAddress();
            const profile = await api.profiles.getProfile(address);

            if(testMethods || domainCreated) {
                assert.notEqual(profile, null);
            } else {
                assert.equal(profile, null);
            }
        });
    });

});
