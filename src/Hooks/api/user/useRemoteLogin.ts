/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
/* helpers */
import * as localStorage from 'Helpers/localStorage';
import { AxiosError } from 'axios';
import { History } from 'history';
import { routeTo } from 'Helpers/routeTo';
import { LoginResponse } from './useLogin';
import { useSetupStep } from 'Hooks/api';

type LoginProps = {
    token: string;
};

const remoteLogin = async (dto: LoginProps) => {
    try {
        const { data } = await http.post<LoginResponse>(
            API_URLS.remoteLogin,
            dto
        );
        return data;
    } catch (e) {
        throw e?.response?.data.message || e.message;
    }
};

export const useRemoteLogin = (
    history: History
): UseMutationResult<LoginResponse, AxiosError, LoginProps, unknown> => {
    const { mutate: getSetupStep } = useSetupStep(history);
    return useMutation<LoginResponse, AxiosError, LoginProps, unknown>(
        remoteLogin,
        {
            onSuccess: (data, variables, context) => {
                localStorage.setItem('token', data.access_token);

                getSetupStep();
            },
            onError: () => {
                history.push(routeTo('auth'));
            },
            onMutate: () => {},
            onSettled: () => {},
        }
    );
};
