import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as localStorage from 'Helpers/localStorage';
import { routeTo } from 'Helpers/routeTo';

export const apply401Handler = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('access');
                /*  window.location.replace(routeTo('auth')); */
            }
            return Promise.reject(error);
        }
    );
};
