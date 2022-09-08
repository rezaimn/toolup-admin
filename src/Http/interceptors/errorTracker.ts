import {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { cond, negate, startsWith } from 'lodash/fp';
/* modules */
import rg4js from 'raygun4js';

export const applyErrorTracker = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            return config;
        },
        err => {
            report(err);
            return Promise.reject(err);
        }
    );

    instance.interceptors.response.use(
        (config: AxiosResponse) => config,
        (err: AxiosError) => {
            report(err);
            return Promise.reject(err);
        }
    );

    return instance;
};

const is5XXError = (code: string) => startsWith('5')(code);
const is4XXError = (code: string) => startsWith('4')(code);

const neither = (code: string) =>
    negate(startsWith('4'))(code) && negate(startsWith('5'))(code);

const report = (err: AxiosError | Error): void => {
    try {
        throw err;
    } catch (error) {
        const customData = error;

        if ('response' in err) {
            return cond([
                [
                    is5XXError,
                    () =>
                        rg4js('send', {
                            error,
                            customData,
                            tags: ['5XX'],
                        }),
                ],
                [
                    is4XXError,
                    () =>
                        rg4js('send', {
                            error,
                            customData,
                            tags: ['4XX'],
                        }),
                ],
                [
                    neither,
                    () =>
                        rg4js('send', {
                            error,
                            customData,
                        }),
                ],
            ])(String(err?.response?.status));
        }

        rg4js('send', {
            error,
            customData,
        });
        return undefined;
    }
};
