/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverOptions, useQuery, UseQueryResult } from 'react-query';
import { merge } from 'lodash/fp';
import { UserAccess } from 'Hooks/useUserAccess';

export type User = {
    avatar: string;
    created_at: string;
    email: string;
    email_verified_at: string;
    first_name: string;
    id: number;
    last_login: string;
    last_name: string;
    offboarding_date: string | null;
    onboarding_date: string;
    status: string;
    updated_at: string;
    uuid: string;
    access: UserAccess;
};

const getCurrentUserDetails = async () => {
    const { data } = await http.get(API_URLS.user);
    return data;
};

export const useCurrentUserDetails = (
    config?: QueryObserverOptions<User>
): UseQueryResult<User, unknown> => {
    return useQuery<User>(API_URLS.user, getCurrentUserDetails, {
        staleTime: Infinity /* persist data forever */,
        ...config,
    });
};
