/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
/* types */
import { TeamHttpResponse } from './useAllTeams';

export type AddTeamPayload = {
    name: string;
    url: string;
    categories: string[];
    color?: string;
};
const createTeam = async (dto: AddTeamPayload) => {
    try {
        const { data } = await http.post<TeamHttpResponse>(API_URLS.teams, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

export const useAddTeam = (): UseMutationResult<
    TeamHttpResponse,
    AxiosError,
    AddTeamPayload,
    void
> => {
    return useMutation(createTeam, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
