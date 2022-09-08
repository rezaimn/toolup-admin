/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { Tool } from './useUserTools';

const getSuggestedTools = async () => {
    try {
        const { data } = await http.get(API_URLS.suggestedTools);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useSuggestedTools = (
    options?: UseQueryOptions<Tool[], unknown>
): QueryObserverResult<Tool[], unknown> => {
    return useQuery<Tool[]>(
        API_URLS.suggestedTools,
        getSuggestedTools,
        options
    );
};
