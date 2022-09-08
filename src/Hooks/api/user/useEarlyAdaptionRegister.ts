/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';

export type EarlyAdaptionRegisterProps = {
    first_name: string;
    last_name: string;
    Company_name: string;
    position: string;
    team_size: string;
    subdomain: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const earlyAdaptionRegister = async (dto: EarlyAdaptionRegisterProps) => {
    /*  if you don't want to append headers
        please make sure that shouldAuthenticate is set to false
     */
    try {
        const { data } = await http.post(API_URLS.earlyAdaptionRegister, dto, {
            shouldAuthenticate: false,
        });
        return data;
    } catch (e) {
        throw e?.response?.data.errors || e;
    }
};

export const useEarlyAdaptionRegister = () => {
    return useMutation(earlyAdaptionRegister, {
        onSuccess: data => {
            if (data.location) {
                window.location.replace(data.location);
            }
        },
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
