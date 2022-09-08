/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { getDomain, isGateway, isStaging } from 'Helpers/getDomain';
import { merge } from 'lodash/fp';

type ForgotPasswordProps = {
    email: string;
};

const { subDomain, subSubdomain } = getDomain(window?.location?.hostname);

const forgotPassword = async (dto: ForgotPasswordProps) => {
    /*  if you don't want to append headers
        please make sure that shouldAuthenticate is set to false
     */
    try {
        const subdomain = isStaging ? subSubdomain : subDomain;

        const { data } = await http.post(
            API_URLS.forgotPassword,
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

export const useForgotPassword = () => {
    return useMutation(forgotPassword, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
