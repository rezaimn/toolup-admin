/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { toString } from 'lodash/fp';
import { TeamHttpResponse } from '.';

type Props = {
    teamId: number;
};
const showTeam = async ({ teamId }: Props) => {
    try {
        const { data } = await http.get(API_URLS.showTeam(toString(teamId)));
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useShowTeam = (
    teamId: number,
    options: UseQueryOptions<TeamHttpResponse, unknown, TeamHttpResponse>
): UseQueryResult<TeamHttpResponse, unknown> => {
    return useQuery<TeamHttpResponse>(
        API_URLS.showTeam(toString(teamId)),
        () => showTeam({ teamId }),
        options
    );
};
