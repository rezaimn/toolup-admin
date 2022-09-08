/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { isEqual, noop, times } from 'lodash/fp';
import { queryClient } from 'Services/ReactQueryService';

export type DeleteTeamPayload = {
    teamId: number;
};

const deleteTeam = async ({ teamId }: DeleteTeamPayload) => {
    try {
        const { data } = await http.delete(
            API_URLS.deleteTeam(teamId.toString())
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

type Props = {
    toolType: 'new' | 'organizationTools';
};
export const useCustomDeleteTeam = ({
    toolType,
}: Props): UseMutationResult<unknown, unknown, DeleteTeamPayload, void> => {
    return useMutation(deleteTeam, {
        onSuccess: () => {
            if (isEqual(toolType)('new')) {
                queryClient.invalidateQueries(API_URLS.newTeams);
            }

            if (isEqual(toolType)('organizationTools')) {
                queryClient.invalidateQueries(API_URLS.orgTeams);
            }

            const membersWithoutTeamQueryKey = [
                API_URLS.membersFilter,
                ...times(noop)(5),
                1,
            ];

            queryClient.invalidateQueries(membersWithoutTeamQueryKey);
        },
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
