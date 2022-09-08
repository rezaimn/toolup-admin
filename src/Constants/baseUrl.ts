import { isStaging, isTest } from 'Helpers/getDomain';

const stagingUrl = 'https://api-staging.toolup.io/v1';
const productionUrl = 'https://api.toolup.io/v1';
const testUrl =
    'https://tooluptest-frontend-env.us-east-2.elasticbeanstalk.com/v1'; // https://api-test.toolup.io/v1

const getBaseUrl = (): string => {
    if (isTest) {
        return testUrl;
    }
    if (isStaging) {
        return stagingUrl;
    }
    return productionUrl;
};

const BASE_URL = getBaseUrl();

export default BASE_URL;
