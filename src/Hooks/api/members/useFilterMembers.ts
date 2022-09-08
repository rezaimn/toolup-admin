/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryResult } from 'react-query';
import { DeepPartial } from 'react-hook-form';
import { times, noop } from 'lodash/fp';

export type Member = {
    id: number;
    avatar: string;
    created_at: string;
    email: string;
    email_verified_at: string;
    first_name: string;
    last_login: string;
    last_name: string;
    offboarding_date: string | null;
    onboarding_date: string;
    status: string;
    updated_at: string;
    uuid: string;
    position: string;
    pivot: {
        organization_id: number;
        member_id: number;
        access: string;
        position: string | null;
        created_at: string;
        updated_at: string;
        boarding_date: string;
        status: 'NOT_OFFBOARDED' | 'NOT_ONBOARDED' | 'OFFBOARDED' | 'ONBOARDED';
    };
    teams: {
        color: string;
        id: number;
        name: string;
        pivot: {
            member_id: number;
            team_id: number;
        };
    }[];
};

export type FilterMembersData = DeepPartial<{
    query: {
        status: 'NOT_ONBOARDED' | 'ONBOARDED' | 'OFFBOARDED' | 'NOT_OFFBOARDED';
        onboarding_date_from: string;
        onboarding_date_to: string;
        offboarding_date_from: string;
        offboarding_date_to: string;
        team_id: number;
        access: string;
        teams_count: number;
    };
    options: {
        orderBy: {
            field: string;
            sort: string;
        };
    };
}>;

const filterMembers = async (dto: FilterMembersData) => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.post(API_URLS.membersFilter, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useFilterMembers = (
    dto: FilterMembersData
): UseQueryResult<Member[], unknown> => {
    return useQuery<Member[]>(
        [
            API_URLS.membersFilter,
            dto.query?.status,
            dto.query?.offboarding_date_from,
            dto.query?.offboarding_date_to,
            dto.query?.onboarding_date_from,
            dto.query?.onboarding_date_to,
            dto.query?.teams_count,
        ],
        () => filterMembers(dto)
    );
};

export const membersWithoutTeamQueryKey = [
    API_URLS.membersFilter,
    ...times(noop)(5),
    1,
];
export const membersWithTeamQueryKey = [
    API_URLS.membersFilter,
    ...times(noop)(5),
    2,
];
