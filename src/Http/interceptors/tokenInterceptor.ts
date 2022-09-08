import { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as localStorage from 'Helpers/localStorage';

interface AuthRequestConfig {
    /**
     * @default true
     */
    shouldAuthenticate?: boolean;
}

declare module 'axios' {
    interface AxiosRequestConfig extends AuthRequestConfig {}
}

export const applyTokenInterceptor = (instance: AxiosInstance) => {
    return instance.interceptors.request.use((config: AxiosRequestConfig) => {
        const { shouldAuthenticate = true } = config;

        if (shouldAuthenticate) {
            // * some logic to read Bearer token from localStorage
            config.headers.authorization = `Bearer ${localStorage.getItem(
                'token'
            )}`;
        }
        return config;
    });
};
