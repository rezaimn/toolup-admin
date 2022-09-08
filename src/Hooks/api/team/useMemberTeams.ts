/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { TeamHttpResponse } from 'Hooks/api/teams/useAllTeams';

export const getMemberTeams = async (): Promise<TeamHttpResponse[]> => {
    try {
        const { data } = await http.get(API_URLS.teams);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useMemberTeams = (
    options: UseQueryOptions<TeamHttpResponse[], unknown>
): QueryObserverResult<TeamHttpResponse[], unknown> => {
    return useQuery<TeamHttpResponse[]>(
        API_URLS.teams,
        getMemberTeams,
        options
    );
};
