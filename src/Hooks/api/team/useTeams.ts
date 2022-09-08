import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, useQuery } from 'react-query';
import { Team } from '../../../Store/team/models/Team';

const getOrgTeams = async () => {
    const { data } = await http.get(API_URLS.orgTeams);
    return data;
};

export const useOrgTeams = () => {
    return useQuery<Team[]>(API_URLS.orgTeams, getOrgTeams);
};

const getTeamById = async (teamId: any) => {
    const { data } = await http.get(`${API_URLS.teams}/${teamId}`);
    return data;
};

export const useGetTeamById = (id: any) => {
    return useQuery<Team>(API_URLS.teams, () => getTeamById(id));
};

const createNewTeam = async (body: Team) => {
    const { data } = await http.post(API_URLS.teams, body);
    return data;
};

export const useNewTeam = () => {
    return useMutation(createNewTeam);
};

const updateTeam = async (body: any) => {
    // @ts-ignore
    const { data } = await http.put(`${API_URLS.teams}/${body.id}`, body);
    return data;
};

export const useUpdateTeam = () => {
    return useMutation(updateTeam);
};

const deleteTeam = async (teamId: number) => {
    const { data } = await http.delete(`${API_URLS.teams}/${teamId}`);
    return data;
};

export const useDeleteTeam = () => {
    return useMutation(deleteTeam);
};

const attachMemberToTeam = async (body: { member_id: any; team_id: any }) => {
    const { data } = await http.put(`/teams/${body.team_id}/members`, {
        member_id: body.member_id,
    });
    return data;
};

export const useAttachMemberToTeam = () => {
    return useMutation(attachMemberToTeam);
};

const detachMemberFromTeam = async (body: { member_id: any; team_id: any }) => {
    const { data } = await http.delete(
        `/teams/${body.team_id}/members/${body.member_id}`,
        {}
    );
    return data;
};

export const useDetachMemberFromTeam = () => {
    return useMutation(detachMemberFromTeam);
};

const bulkDetachMembersFromTeam = async (body: {
    teamId: any;
    member_ids: [];
}) => {
    const {
        data,
    } = await http.post(`/teams/${body.teamId}/members/bulk/delete`, {
        member_ids: body.member_ids,
    });
    return data;
};

export const useBulkDetachMembersFromTeam = () => {
    return useMutation(bulkDetachMembersFromTeam);
};
