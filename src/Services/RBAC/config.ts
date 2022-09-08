import API_URLS from 'Constants/apiUrls';
import * as localStorage from 'Helpers/localStorage';
import { UserAccess } from 'Hooks';
import { User } from 'Hooks/api';
import { includes } from 'lodash/fp';
import { queryClient } from 'Services/ReactQueryService';

const userKeys: UserAccess[] = ['Normal User'];

export const isNormalUser = (): boolean => {
    const data = queryClient.getQueryData<User>(API_URLS.user);
    return includes(data?.access)(userKeys);
};

const adminKeys: UserAccess[] = ['Super Admin', 'Owner'];

export const isAdmin = (): boolean => {
    const data = queryClient.getQueryData<User>(API_URLS.user);
    return includes(data?.access)(adminKeys);
};
