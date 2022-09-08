/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { Tool } from './useUserTools';

const getTool = async (toolId: number) => {
    try {
        const { data } = await http.get<Tool>(API_URLS.tool(toolId));

        const toolStringifiedConfig = {
            ...data,
            pivot: {
                ...data?.pivot,
                config: data?.pivot?.config
                    ? JSON.parse(data?.pivot?.config as any)
                    : {},
            },
        } as Tool;
        return toolStringifiedConfig;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useTool = (
    toolId: number,
    options?: UseQueryOptions<Tool, unknown>
): QueryObserverResult<Tool, unknown> => {
    return useQuery<Tool>(
        API_URLS.tool(toolId),
        () => getTool(toolId),
        options
    );
};
