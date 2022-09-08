import { isProduction } from 'Helpers/getDomain';
import TagManager, { TagManagerArgs } from 'react-gtm-module';

const tagManagerArgs: TagManagerArgs = {
    gtmId: 'GTM-KTGNNHX',
};

export const initializeGoogleTagManager = (): void => {
    if (isProduction) {
        TagManager.initialize(tagManagerArgs);
    }
};
