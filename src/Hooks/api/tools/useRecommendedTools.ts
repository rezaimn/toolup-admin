/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { Tool } from './useUserTools';
import { merge } from 'lodash/fp';
import { DeepPartial } from 'redux';

type Filter = {
    query: {
        attribute: string;
        origin: string;
        usage_status: string;
    };
};

const getRecommendedTools = async (filter: DeepPartial<Filter>) => {
    try {
        const defaultFilter = {
            query: {
                attribute: 'recommended',
                origin: 'SYSTEM',
                usage_status: 'unconfigured',
            },
        };

        const { data } = await http.post(
            API_URLS.recommendedTools,
            merge(defaultFilter)(filter)
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useRecommendedTools = (
    filter: DeepPartial<Filter>,
    options?: UseQueryOptions<Tool[], unknown>
): QueryObserverResult<Tool[], unknown> => {
    return useQuery<Tool[]>(
        API_URLS.recommendedTools,
        () => getRecommendedTools(filter),
        options
    );
};
