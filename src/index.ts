export { Profile } from './profile';
export { registerProfile, setProperties, removeProperties } from './profile/methods';
export { getProfile } from './profile/queries';

export { Domain, Resolver } from './domain';
export { registerDomain, extendRegistration, setRecords, deleteRecords } from './domain/methods';
export { getDomain, getResolver } from './domain/queries';