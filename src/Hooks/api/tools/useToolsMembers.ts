/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverOptions, useQuery, UseQueryResult } from 'react-query';
import { Tool } from 'Hooks/api/tools/useUserTools';
import { FilterOnboardingOffboardingState } from 'Pages/OnbaordingOffboarding/OnbaordingOffboarding';
import { merge, pipe, omit } from 'lodash/fp';

type Dto = {
    toolId: number;
    payload: Partial<FilterOnboardingOffboardingState>;
};

const getToolMembers = async ({ toolId, payload }: Dto) => {
    try {
        const { data } = await http.post(API_URLS.toolMembers(toolId), {
            query: payload,
        });
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useToolMembers = (
    toolId: number,
    payload: Partial<FilterOnboardingOffboardingState>,
    options?: QueryObserverOptions<Tool[], unknown>
): UseQueryResult<Tool[], unknown> => {
    return useQuery<Tool[]>(
        [API_URLS.toolMembers(toolId), payload.boarding_date_from],
        () => getToolMembers({ toolId, payload }),
        options
    );
};
