/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';

import { getDomain, isStaging } from 'Helpers/getDomain';
import { merge } from 'lodash/fp';
import { toast } from 'Components/Atomes/ToastContainer';

type ResetPasswordProps = {
    password: string;
    password_confirmation: string;
};

const { subDomain, subSubdomain } = getDomain(window?.location?.hostname);

const resetPassword = async (dto: ResetPasswordProps) => {
    /*  if you don't want to append headers
        please make sure that shouldAuthenticate is set to false
     */
    try {
        const subdomain = isStaging ? subSubdomain : subDomain;

        const { data } = await http.post(
            API_URLS.resetPassword,
            merge({ subdomain })(dto),
            {
                shouldAuthenticate: false,
            }
        );
        return data;
    } catch (e) {
        throw e?.response?.data || e;
    }
};

export const useResetPassword = () => {
    return useMutation(resetPassword, {
        onSuccess: r => {
            toast('info', r?.message);
        },
        onError: (e: any) => {
            toast('error', e?.errors?.message);
        },
        onMutate: () => {},
        onSettled: () => {},
    });
};
