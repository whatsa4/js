<h1>@snsdomains/domains.js</h1>

![build workflow](https://github.com/snsdomains/js/actions/workflows/tests.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@snsdomains%2Fidl.svg)](https://badge.fury.io/js/@snsdomains%2Fidl)

The Sui Name Service is the first community-run name service on the Sui Network. This package provides all the JavaScript resources to
interact with the domains program. 

## Getting Started
For a quick start guide, please see the examples below or view the documentation here. The library is very
straightforward and actively used in production. If you require any on-boarding assistance or have a partnership requests,
please email us at `partners@sns.domains`.

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
Here is an example of all the available methods.

```typescript
import {getResolver, getDomain} from '@snsdomains/js';
import {JsonRpcProvider} from "@mysten/sui.js";

const provider = new JsonRpcProvider(Network.DEVNET);

// get the domain owner "anthony.sui" - ALWAYS SEND TO THIS ADDRESS
const owner: SuiAddress = await getDomainOwner(provider, "anthony.sui");

// get the domain NFT for "anthony.sui"
const domain: DomainNFT = await getDomainNFT(provider, "anthony.sui");

// get the domain records associated with "anthony.sui"
const resolver: Resolver = await getResolver(provider, "anthony.sui");

// get a user's profile on Sui (automatically created)
const userAddress = "0xc78184323182485f24e9484b52c42436b7410fc2";
const profile: Profile = await getProfile(provider, userAddress);
