/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';

export type TeamMember = {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    email_verified_at: string;
    last_login: string;
    status: string;
    onboarding_date: string;
    offboarding_date: null;
    created_at: string;
    updated_at: string;
    position: string;
    pivot: {
        team_id: number;
        member_id: number;
    };
};

const getTeamMembers = async (teamId: number) => {
    try {
        const { data } = await http.get(API_URLS.teamMembers(teamId));
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useTeamMembers = (
    teamId: number,
    options: UseQueryOptions<TeamMember[], unknown>
): QueryObserverResult<TeamMember[], unknown> => {
    return useQuery<TeamMember[]>(
        ['teamMembers', teamId],
        () => getTeamMembers(teamId),
        options
    );
};
