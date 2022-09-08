/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { Tool } from './useUserTools';

const getUnusedTolls = async () => {
    try {
        const { data } = await http.get(API_URLS.unusedTools);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useUnusedTools = (
    options?: UseQueryOptions<Tool[], unknown>
): QueryObserverResult<Tool[], unknown> => {
    return useQuery<Tool[]>(API_URLS.unusedTools, getUnusedTolls, options);
};
