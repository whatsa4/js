<div align="center">
  <h1>@snsdomains/js</h1>
</div>

![build workflow](https://github.com/snsdomains/js/actions/workflows/tests.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@snsdomains%2Fidl.svg)](https://badge.fury.io/js/@snsdomains%2Fidl)

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

####Sui Devnet
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
*Resolve a domain in three lines of code!* </br>
Below are listed all of our available query methods.

```typescript
import {getResolver, getDomainNFT, getDomainAddress} from '@snsdomains/js';
import {JsonRpcProvider} from "@mysten/sui.js";

const provider = new JsonRpcProvider(Network.DEVNET);

// get the address for "anthony.sui" - ALWAYS SEND TO THIS ADDRESS
const address: SuiAddress = await getDomainAddress(provider, "anthony.sui");

// get the domain NFT for "anthony.sui"
const domain: DomainNFT = await getDomainNFT(provider, "anthony.sui");

// get the domain records associated with "anthony.sui"
const resolver: Resolver = await getResolver(provider, "anthony.sui");

// get a user's profile on Sui (automatically created)
const userAddress = "0xc78184323182485f24e9484b52c42436b7410fc2";
const profile: Profile = await getProfile(provider, userAddress);
