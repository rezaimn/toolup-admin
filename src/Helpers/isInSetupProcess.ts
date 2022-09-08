import { startsWith } from 'lodash/fp';

export const isInSetupProcess = (): boolean => {
    return startsWith('/intro')(window?.location?.pathname);
};
