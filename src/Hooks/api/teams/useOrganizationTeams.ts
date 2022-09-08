/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';
import { TeamHttpResponse } from 'Hooks/api/teams/useAllTeams';
import { isNil, negate, toString } from 'lodash/fp';

export const getOrganizationTeams = async (): Promise<TeamHttpResponse[]> => {
    try {
        const { data } = await http.get(API_URLS.orgTeams);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

const showTeam = async ({ teamId }: { teamId?: string }) => {
    try {
        const { data } = await http.get(API_URLS.showTeam(toString(teamId)));
        return [data];
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

type P = {
    teamId?: string;
};

export const useOrganizationTeams = (
    teamId?: string
): QueryObserverResult<TeamHttpResponse[], unknown> => {
    /* 
    
    */
    if (negate(isNil)(teamId)) {
        return useQuery<TeamHttpResponse[]>(
            API_URLS.showTeam(toString(teamId)),
            () => showTeam({ teamId })
        );
    }

    return useQuery<TeamHttpResponse[]>(
        API_URLS.orgTeams,
        getOrganizationTeams
    );
};
