import {
    split,
    pipe,
    reverse,
    isUndefined,
    isEqual,
    includes,
} from 'lodash/fp';

type GetDomainType = {
    suffix: string;
    domain: string;
    subDomain: string;
    subSubdomain: string;
};

export const getDomain = (hostname: string): GetDomainType => {
    const [suffix, domain, subDomain, subSubdomain] = pipe(
        split('.'),
        reverse
    )(hostname);

    return { suffix, domain, subDomain, subSubdomain };
};

const { subDomain, subSubdomain } = getDomain(window?.location?.hostname);

const isSubdomainStaging = subDomain === 'staging';
const isSubSubDomainDefined = subSubdomain !== undefined;
const isSubSubDomainUndefined = subSubdomain === undefined;
const subDomainIsNotStaging = subDomain !== 'staging';
const isSubSubdomainAuth = isEqual('auth')(subSubdomain);
export const isStaging = isSubSubDomainDefined && isSubdomainStaging;

export const subSubDomainIsTest = subSubdomain?.includes('test');
export const isTest = subSubDomainIsTest;

const isSubDomainAuth = isEqual('auth')(subDomain);
export const isProduction = isSubSubDomainUndefined && subDomainIsNotStaging;
export const isGateway =
    (isSubSubdomainAuth && isSubdomainStaging) ||
    (isSubDomainAuth && !isStaging) ||
    isTest;

export const isAuthSubdomain =
    (isSubSubdomainAuth && isStaging) || (isSubDomainAuth && !isStaging);

export const isProductionAuth = isSubDomainAuth && !isStaging;
export const isStagingAuth = isSubSubdomainAuth && isStaging;
