import {step} from "mocha-steps";
import {
    Ed25519Keypair,
    JsonRpcProvider,
    Network,
    RawSigner,
    SuiMoveObject,
    SuiObject
} from "@mysten/sui.js";
import * as assert from "assert";
import {SnsApi} from "../src";
import {getObjects, queryForObjects} from "../src/objects";
import crypto from 'crypto';

const nacl = require('tweetnacl');

describe("Sui Name Service - query api tests", async () => {
    // make random key
    const testMethods = false;

    const keypair = nacl.sign.keyPair();
    const provider = new JsonRpcProvider(Network.DEVNET);
    let api = new SnsApi(provider, Network.DEVNET);

    const signer = new RawSigner(Ed25519Keypair.fromSecretKey(keypair.secretKey), api.provider);
    const domain_name = crypto.randomBytes(20).toString('hex');

    it("program - deployed", async function() {
        const timeOracleId = getObjects(Network.DEVNET).timeOracleId;
        const timeOracleQueryResponse = await provider.getObject(timeOracleId);
        assert.equal(timeOracleQueryResponse.status, 'Exists', 'program not deployed or old objects.json');
    });

    if(testMethods) {
        step("fund account", async function () {
            const suiAddress = await signer.getAddress();
            console.log('signer address', suiAddress);

            const response = await signer.requestSuiFromFaucet();
            assert.equal(response.error, null);
        });

        describe("domains - methods", async function() {
            step("registerDomain", async function() {
                const signerAddress = await signer.getAddress();

                const coins = await provider.getCoinBalancesOwnedByAddress(signerAddress, "0x2::sui::SUI");
                const coinsId = ((coins[0].details as SuiObject).data as SuiMoveObject).fields.id.id;


                const domainTx = await api.domains.registerDomain({
                    sender: signerAddress,
                    name: domain_name,
                    tld: "sui",
                    years: 1,
                    coins: coinsId,
                    gasBudget: 100_000
                });

                const response = await signer.executeMoveCallWithRequestType(domainTx);
                assert.equal(response['EffectsCert']['effects']['effects']['status']['status'], 'success', response.toString());
            });
        });
    }

    it("api - query 'objects.json'", async function() {
        const objects = await queryForObjects(Network.DEVNET);
        assert.notEqual(objects.packageId, null, 'PackageID from github null');
    });

    describe("domains - queries", async function() {
        step("getResolver", async function() {
            const resolver = await api.domains.getResolver(domain_name);

            if(testMethods) {
                assert.notEqual(resolver, null);
            } else {
                assert.equal(resolver, null);
            }
        });

        step("getDomain", async function() {
            const domain = await api.domains.getDomainNFT(domain_name);

            if(testMethods) {
                assert.notEqual(domain, null);
            } else {
                assert.equal(domain, null);
            }
        });

        step("getAddress", async function() {
            const address = await api.domains.getAddress("5a2c1a6e2bf54bf11afc346ab54e20cd91c56267.sui");

            console.log(address);
        })
    });

});
