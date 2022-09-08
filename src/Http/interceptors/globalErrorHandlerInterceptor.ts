import {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { toast } from 'Components/Atomes/ToastContainer';

interface ReponseErrorHandlerConfig {
    /**
     * @default false
     */
    shouldHandleInGlobalLevel?: boolean;
}

declare module 'axios' {
    interface AxiosRequestConfig extends ReponseErrorHandlerConfig {}
}

export const applyGlobalErrorHandler = (instance: AxiosInstance) => {
    let handleGlobally: boolean | undefined;

    instance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const { shouldHandleInGlobalLevel = false } = config;
            handleGlobally = shouldHandleInGlobalLevel;
            return config;
        },
        (err: Error) => {
            if (handleGlobally) {
                toast('error', err?.message);
            }
            return Promise.reject(err);
        }
    );

    instance.interceptors.response.use(
        (config: AxiosResponse) => config,
        (err: AxiosError) => {
            if (handleGlobally) {
                toast('error', err.response?.data?.errors?.message);
            }
            return Promise.reject(err);
        }
    );

    return instance;
};
