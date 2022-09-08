/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* helpers */
import { replaceElement } from 'Helpers/replaceElement';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { queryClient } from 'Services/ReactQueryService';
import {
    cloneDeep,
    filter,
    find,
    findIndex,
    includes,
    isEqual,
    pipe,
    unionBy,
    uniqBy,
    toString,
    negate,
    last,
    get,
} from 'lodash/fp';

import { TeamHttpResponse } from './useAllTeams';
import { Member, membersWithoutTeamQueryKey } from '../members';

export type AddMembersToTeamPayload = {
    teamId: number;
    member_ids: number[];
    isSingleTeam: boolean;
    teamName: string;
};

const addMembersToTeam = async ({
    teamId,
    isSingleTeam,
    teamName,
    ...dto
}: AddMembersToTeamPayload) => {
    try {
        const { data } = await http.post(
            API_URLS.addMembersToTeam(teamId.toString()),
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useAddMembersToTeam = (): UseMutationResult<
    unknown,
    unknown,
    AddMembersToTeamPayload,
    void
> => {
    return useMutation(addMembersToTeam, {
        onMutate: variables => {
            const members = queryClient.getQueryData(
                membersWithoutTeamQueryKey
            ) as Member[];

            /* if it was in the main page of all of teams then do this */
            if (!variables.isSingleTeam) {
                const teams = queryClient.getQueryData(
                    API_URLS.newTeams
                ) as TeamHttpResponse[];

                const team = find<TeamHttpResponse>(t =>
                    isEqual(t.id)(variables.teamId)
                )(teams) as TeamHttpResponse;

                const teamIndex = findIndex<TeamHttpResponse>(t =>
                    isEqual(t.id)(variables.teamId)
                )(teams) as number;

                const teamMembers = queryClient.getQueryData([
                    'teamMembers',
                    team.id,
                ]) as Member[];

                const updatedMembers = filter<Member>(m =>
                    includes(m.id)(variables.member_ids)
                )(members);

                queryClient.setQueryData(
                    ['teamMembers', team.id],
                    pipe(unionBy('id'))([...teamMembers, ...updatedMembers])
                );
                const uniq = pipe(uniqBy('id'))([
                    ...teamMembers,
                    ...updatedMembers,
                ]) as TeamHttpResponse[];

                const updatedTeam = cloneDeep(team);
                updatedTeam.members_count = uniq.length;
                queryClient.setQueryData(
                    API_URLS.newTeams,
                    replaceElement(teams, updatedTeam, teamIndex)
                );
            }

            /* if it was a single team, then:  */
            if (variables.isSingleTeam) {
                const team = queryClient.getQueryData(
                    API_URLS.showTeam(toString(variables.teamId))
                ) as TeamHttpResponse;

                const teamMembers = queryClient.getQueryData([
                    'teamMembers',
                    team.id,
                ]) as Member[];

                const updatedMembers = filter<Member>(m =>
                    includes(m.id)(variables.member_ids)
                )(members);

                queryClient.setQueryData(
                    ['teamMembers', team.id],
                    pipe(unionBy('id'))([...teamMembers, ...updatedMembers])
                );
                const uniq = pipe(uniqBy('id'))([
                    ...teamMembers,
                    ...updatedMembers,
                ]) as TeamHttpResponse[];

                const updatedTeam = cloneDeep(team);
                updatedTeam.members_count = uniq.length;

                queryClient.setQueryData(
                    API_URLS.showTeam(toString(variables.teamId)),
                    updatedTeam
                );
            }

            const sanitizedMembers = pipe(
                filter<Member>(i =>
                    negate(includes(i.id))(variables.member_ids)
                )
            )(members);

            queryClient.setQueryData(
                membersWithoutTeamQueryKey,
                sanitizedMembers
            );
        },
        onError: (_, variables) => {},
        onSuccess: () => {},
        onSettled: () => {},
    });
};
