/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
/* helpers */
import * as localStorage from 'Helpers/localStorage';
import { routeTo } from 'Helpers/routeTo';

const logout = async () => {
    try {
        const { data } = await http.post(API_URLS.logout);
        return data;
    } catch (e) {
        throw e?.response?.data.errors || e.message;
    }
};

export const useLogout = (): UseMutationResult => {
    return useMutation(logout, {
        onSuccess: (data, variables) => {
            localStorage.setItem('token', '');
            /*  localStorage.setItem('access', ''); */
            window.location.replace(routeTo('auth'));
        },
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
