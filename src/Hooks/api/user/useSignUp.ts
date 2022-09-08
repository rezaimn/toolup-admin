/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';

type SignupProps = {
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

const signup = async (dto: SignupProps) => {
    /*  if you don't want to append headers
        please make sure that shouldAuthenticate is set to false
     */
    try {
        const { data } = await http.post(API_URLS.signUp, dto, {
            shouldAuthenticate: false,
        });
        return data;
    } catch (e) {
        throw e?.response?.data.errors || e;
    }
};

export const useSignUp = () => {
    return useMutation(signup, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
