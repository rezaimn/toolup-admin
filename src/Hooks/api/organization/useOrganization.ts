/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery } from 'react-query';

export type Organization = {
    id: number;
    name: string;
    team_size: string;
    subdomain: string;
    logo: string;
    setup_finished: boolean;
    setup_process_step: string;
    created_at: string;
    updated_at: string;
};

const getOrganization = async () => {
    try {
        const { data } = await http.get(API_URLS.organization);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useOrganization = (): QueryObserverResult<
    Organization,
    unknown
> => {
    return useQuery<Organization>(API_URLS.organization, getOrganization);
};
