import API_URLS from 'Constants/apiUrls';
import { http } from 'Http/api';
import { useMutation, UseMutationResult } from 'react-query';

export type DeleteMembersFromTeamPayload = {
    teamId: number;
    member_ids: number[];
};

const deleteMembersFromTeam = async ({
    teamId,
    ...dto
}: DeleteMembersFromTeamPayload) => {
    try {
        const { data } = await http.post(
            API_URLS.deleteMembersFromTeam(teamId.toString()),
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useDeleteMembersFromTeam = (): UseMutationResult<
    unknown,
    unknown,
    DeleteMembersFromTeamPayload,
    void
> => {
    return useMutation(deleteMembersFromTeam, {
        onMutate: variables => {},
        onError: (_, variables) => {},
        onSuccess: () => {},
        onSettled: () => {},
    });
};
