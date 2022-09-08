/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';

export type Tool = {
    created_at: string;
    icon: string;
    id: number;
    members_count: number;
    name: string;
    organization_id: number;
    origin: string;
    teams_count: number;
    type: null;
    updated_at: string;
    url: string;
    categories: any[];
    pivot?: {
        config: {
            url: string;
        };
        created_at: string;
        tool_id: number;
        organization_id: number;
        updated_at: string;
    };
};

const getUserTools = async () => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.get(API_URLS.userTools);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useUserTools = (
    options?: UseQueryOptions<Tool[], unknown>
): QueryObserverResult<Tool[], unknown> => {
    return useQuery<Tool[]>(API_URLS.userTools, getUserTools, options);
};
