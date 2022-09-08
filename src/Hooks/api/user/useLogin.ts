/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
/* helpers */
import * as localStorage from 'Helpers/localStorage';
import { AxiosError } from 'axios';
import { getDomain, isGateway, isStaging } from 'Helpers/getDomain';
import { merge, pipe, split, last } from 'lodash/fp';
import { isDevelopment, isProduction, PORT } from 'Constants/configs';
import { routeTo } from 'Helpers/routeTo';
import queryString from 'query-string';

type LoginProps = {
    email: string;
    password: string;
};

export type LoginResponse = {
    access_token: string;
    last_login: string;
    subdomain: string;
    location: string;
    user: {
        access: string;
        avatar: string;
        created_at: string;
        email: string;
        email_verified_at: string;
        first_name: string;
        id: number;
        last_login: string;
        last_name: string;
        offboarding_date: null;
        onboarding_date: null;
        organization_id: 4;
        position: string;
        status: string;
        updated_at: string;
        uuid: string;
    };
};

const { subDomain, subSubdomain } = getDomain(window?.location?.hostname);

const login = async (dto: LoginProps) => {
    try {
        const subdomain = isStaging ? subSubdomain : subDomain;
        const { data } = await http.post<LoginResponse>(
            API_URLS.login,
            isGateway ? dto : merge({ subdomain })(dto),
            {
                shouldAuthenticate: false,
            }
        );
        return data;
    } catch (e) {
        throw e?.response?.data.errors || e.message;
    }
};

export const useLogin = (): UseMutationResult<
    LoginResponse,
    AxiosError,
    LoginProps,
    unknown
> => {
    return useMutation<LoginResponse, AxiosError, LoginProps, unknown>(login, {
        onSuccess: (data, variables, context) => {
            localStorage.setItem('token', data.access_token);

            if (data.location && isProduction) {
                window.location.replace(data.location);
            }

            if (isDevelopment) {
                const {
                    domain,
                    subDomain: navigationSubDomain,
                    subSubdomain: navigationSubSubdomain,
                } = getDomain(data.location);

                const url = pipe(split('?'), last)(data?.location);
                const query = queryString.parse(url as string, {});

                window.location.replace(
                    `${navigationSubSubdomain}.${navigationSubDomain}.${domain}.local:${PORT}${routeTo(
                        'remoteLogin',
                        undefined,
                        { token: query?.token as string }
                    )}`
                );
            }
        },
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
