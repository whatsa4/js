# `@snsdomains/js`

![build workflow](https://github.com/snsdomains/js/actions/workflows/tests.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@snsdomains%2Fjs.svg)](https://badge.fury.io/js/@snsdomains%2Fjs)

The Sui Name Service is a decentralized naming and identity protocol for the Sui Network. This package provides all the JavaScript resources to
interact with the on-chain [domains](https://github.com/snsdomains/domains) program. We are proudly open-source and community-run.

Install with [npm](https://www.npmjs.com/):
```shell
$ npm install @snsdomains/js
```

Install with [yarn](https://yarnpkg.com):
```shell
$ yarn add @snsdomains/js
```

## Quick start

For a quick start guide, please see the examples below. The library is very
lightweight and actively used in our production software. If you require any on-boarding assistance or have a partnership requests,
please email us at `anthony@sns.domains`.

###Sui Devnet
Please note that the Sui devnet updates will require us to update this library to work with the new deployed addresses. All you have to do is update
this library locally, and it will automatically use the correct addresses.

## Built to Scale

The Sui Name Service domains program is built to scale to 100m+ names on-chain with O(log n) base-lookup time for each name and O(1) for consecutive queries. 
The API structure for domains is as follows:
1. **Resolver**: Associates a domain with records and an ownership NFT. (Can be cached)
2. **Domain NFT**: Represents ownership of the domain name. Whoever owns this NFT is automatically the resolvable address for the domain.
3. **Profile**: Automatically created with a user's first domain registration (free of charge). This is
used to reflect a user's identity on Sui and can be configured with all elements of their basic profile. It 
is stored as an object owned by the user.

To prevent confusion, the **DomainNFT** owner will always be the resolvable address of the domain.
This was done to prevent mis-transfers of funds following secondary sales, and the limited use cases
associated with changing the resolvable address of a domain.

## Examples
*Resolve a domain in five lines of code!* </br>
Below are listed all of our available query methods.

**GET a Domain's `SuiAddress`** <br/>
This is the core query of the Sui Name Service and resolves a domain to its owner. <br/>
Our library is made to work whenever the Sui Network resets without you having to update
to a new version. It automatically fetches our latest deployed program IDs from Github.

```typescript
import {SnsApi, queryForObjects} from '@snsdomains/js';
import {JsonRpcProvider, Network} from "@mysten/sui.js";

// *This is only required for dev-net.
// It fetches our program IDs without you having to update this library
const objects = await queryForObjects(Network.DEVNET);

// Configure API / provider
const provider = new JsonRpcProvider(Network.DEVNET);
const api = new SnsApi(provider, Network.DEVNET, objects);

// Resolve domain
const address = await api.domains.getAddress("anthony.sui");
```

**GET an Ownership `DomainNFT`**
```typescript
const nft = await api.domains.getDomainNFT("anthony.sui");
```

**GET a `DomainResolver`**<br/>
Domain name-service records are stored on the resolver.
For consecutive queries of the same name, please cache the domain's `Resolver` and use it
to re-query the domain address or records.
```typescript
const resolver = await api.domains.getResolver("anthony.sui");
```

**GET a user's Sui `Profile`**<br/>
```typescript
const userAddress = "0xc4173a804406a365e69dfb297d4eaaf002546ebd"
const profile = await api.profiles.getProfile(userAddress);
```





### Versioning
* 0.0.1 Increase: **object.json** update
* 0.1.0 Increase: feature update
* 1.0.0 Increase: major / breaking changes