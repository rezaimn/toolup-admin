/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverOptions, useQuery, UseQueryResult } from 'react-query';

export type checkPasswordActivationReturnData = {
    serviceSubscriptionStatus: boolean;
    serviceActivationStatus: boolean;
    memberServiceActivationStatus: boolean;
    memberRole: string;
};

const checkPasswordServiceActivation = async () => {
    const { data } = await http.get(
        API_URLS.passwordManagement.checkPasswordActivation
    );
    return data;
};

export const useCheckPasswordServiceActivation = (
    config?: QueryObserverOptions<checkPasswordActivationReturnData>
): UseQueryResult<checkPasswordActivationReturnData, unknown> => {
    return useQuery<checkPasswordActivationReturnData>(
        API_URLS.passwordManagement.checkPasswordActivation,
        checkPasswordServiceActivation,
        {
            staleTime: Infinity /* persist data forever */,
            ...config,
        }
    );
};
