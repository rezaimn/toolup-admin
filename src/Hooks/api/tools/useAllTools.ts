/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Tool } from 'Hooks/api/tools/useUserTools';

const getAllTools = async (mode: AllToolsQueryMode) => {
    const url = mode === 'allTools' ? API_URLS.allTools : API_URLS.unConfiguredTools

    try {
        const { data } = await http.get(url);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export type AllToolsQueryMode = 'allTools' | 'unConfiguredTools'
export const useAllTools = (
    options?: UseQueryOptions<Tool[]>,
    mode: AllToolsQueryMode = 'allTools'
): UseQueryResult<Tool[]> => {
    const queryKey = mode === 'allTools' ? API_URLS.allTools : API_URLS.unConfiguredTools
    return useQuery<Tool[]>(queryKey, () => getAllTools(mode), options);
};
