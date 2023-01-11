export { Profile } from './profile';
export { registerProfile, setProperties, removeProperties } from './profile/methods';
export { getProfile } from './profile/queries';

export { ResolverRecord, DomainNFT, Resolver } from './domain';
export { registerDomain, extendRegistration, setRecords, deleteRecords } from './domain/methods';
export { getResolver, getDomainNFT, getDomainAddress } from './domain/queries';