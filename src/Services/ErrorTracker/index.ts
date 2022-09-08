import { isProduction, isProductionAuth } from 'Helpers/getDomain';
import rg4js from 'raygun4js';
/* configs */

/* first is for production, second is for staging */
const apiKey =
    isProduction || isProductionAuth
        ? 'quYfUznDemuR1g1rPfg'
        : 'uG8aJCsmCZzNA8s8jI6XXA';

export const initializeErrorTracker = (): void => {
    rg4js('apiKey', apiKey);
    rg4js('enableCrashReporting', true);
    rg4js('logContentsOfXhrCalls', true);
    rg4js('enablePulse', true);

    rg4js('options', {
        ignoreAjaxAbort: true,
        excludedHostnames: ['.local', 'localhost'],
        ignoreAjaxError: false,
    });
};
