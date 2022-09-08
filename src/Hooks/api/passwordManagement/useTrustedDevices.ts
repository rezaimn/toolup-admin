/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverOptions, useQuery, UseQueryResult } from 'react-query';

export type TrustedDevice = {
    id: number;
    uuid: string;
    member_id: number;
    client: string;
    client_version: string;
    user_agent: string;
    os_name: string;
    os_version: string;
    last_ip: string;
    country: string;
    country_alpha2: string;
    last_used: string;
    created_at: string;
    updated_at: string;
};

export const getTrustedDevices = async (): Promise<TrustedDevice[]> => {
    try {
        const { data } = await http.get(API_URLS.passwordManagement.devices);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

export const useTrustedDevices = (
    options?: QueryObserverOptions<TrustedDevice[], unknown>
): UseQueryResult<TrustedDevice[], unknown> => {
    return useQuery(API_URLS.passwordManagement.devices, getTrustedDevices, {
        onSuccess: () => {},
        onError: () => {},
        onSettled: () => {},
        ...options,
    });
};
