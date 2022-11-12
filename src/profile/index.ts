const { packageId } = require('../objects.json');

export interface Profile {
    id: string,
    owner: string,
    url: string,
    primary?: string,
    properties: [string: string],
}

export const type = `${packageId}::profile::Profile`;