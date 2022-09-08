import Axios from 'axios';
// helpers
import * as localStorage from 'Helpers/localStorage';
import { applyTokenInterceptor } from './interceptors/tokenInterceptor';
import { applyGlobalErrorHandler } from './interceptors/globalErrorHandlerInterceptor';
import { apply401Handler } from './interceptors/401Handler';
import { applyErrorTracker } from './interceptors/errorTracker';
/* constants */
import BASE_URL from 'Constants/baseUrl';
import env from '../constants';

const http = Axios.create({
    baseURL: BASE_URL,
});

applyTokenInterceptor(http);
applyGlobalErrorHandler(http);
apply401Handler(http);
applyErrorTracker(http);

export { http };

export function setHeaderToken(token: string) {
    http.defaults.headers = { Authorization: `Bearer ${token}` };
}

export function login(params: any, onSuccess: any): any {
    post('auth/login', params, onSuccess).then((res: any) => {
        if (res && res.access_token) {
            localStorage.setItem('token', res.access_token);
            // setHeaderToken(res.access_token);
        }
    });
}

http.interceptors.request.use(
    function (config: any) {
        // Do something before request is sent
        return config;
    },
    function (error: any) {
        // Do something with request error
        // toast('Error with the server', 'error');
        // localStorage.removeItem('token');
        // history.push("/");
        return Promise.reject(error);
    }
);
// Add a response interceptor
http.interceptors.response.use(function (response: any) {
    // Do something with response data
    return response;
});

export function get(url: string, params?: any): Promise<any> {
    return http
        .get(url, {
            params,
        })
        .then((res: any) => res.data)
        .catch((reason: any) => {
            console.error(reason.message);
        });
}

export function post(
    url: string,
    params?: any,
    config?: any,
    onSuccess?: any
): Promise<any> {
    return http
        .post(url, params, config || {})
        .then(res => {
            if (res.data) {
                onSuccess();
            }
            return res.data;
        })
        .catch(reason => {
            console.error(reason.message);
        });
}

export function put(url: string, params?: any): Promise<any> {
    return http
        .put(url, params)
        .then((res: any) => res.data)
        .catch((reason: any) => {
            console.error(reason.message);
        });
}

export function patch(url: string, params?: any): Promise<any> {
    return http
        .patch(url, params)
        .then((res: any) => res.data)
        .catch((reason: any) => {
            console.error(reason.message);
        });
}

export function deleteReq(url: string, params?: any): Promise<any> {
    return http
        .delete(url, {
            data: params,
        })
        .then((res: any) => res.data)
        .catch((reason: any) => {
            console.error(reason.message);
        });
}
