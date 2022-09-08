/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { TeamHttpResponse } from './useAllTeams';

const getNewTeams = async () => {
    try {
        const { data } = await http.get(API_URLS.newTeams);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useNewTeams = (
    options?: UseQueryOptions<TeamHttpResponse[], unknown, TeamHttpResponse[]>
): UseQueryResult<TeamHttpResponse[], unknown> => {
    return useQuery<TeamHttpResponse[]>(
        API_URLS.newTeams,
        getNewTeams,
        options
    );
};
