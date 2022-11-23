export { Profile } from './profile';
export { registerProfile, setProperties, removeProperties } from './profile/methods';
export { getProfile } from './profile/queries';

export { DomainNFT, Resolver } from './domain';
export { registerDomain, extendRegistration, setRecords, deleteRecords } from './domain/methods';
export { getResolver, getDomainNFT, getDomainOwner } from './domain/queries';