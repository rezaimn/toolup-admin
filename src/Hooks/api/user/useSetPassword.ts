/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { routeTo } from 'Helpers/routeTo';

type SetPasswordProps = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};

const setPassword = async (dto: SetPasswordProps) => {
    /*  if you don't want to append headers
        please make sure that shouldAuthenticate is set to false
     */
    try {
        const { data } = await http.post(API_URLS.setPassword, dto, {
            shouldAuthenticate: false,
        });
        return data;
    } catch (e) {
        throw e?.response?.data || e;
    }
};

export const useSetPassword = () => {
    return useMutation(setPassword, {
        onSuccess: data => {
            localStorage.setItem('token', data.access_token);
            /*  localStorage.setItem('access', data.user.access); */
            if (data.access_token) {
                window.location.replace(routeTo('dashboard'));
            }
        },
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
