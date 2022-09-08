/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import { queryClient } from 'Services/ReactQueryService';
import { toast } from 'Components/Atomes/ToastContainer';

type ResetOrganizationPayload = Partial<{
    reset_members: boolean;
    reset_teams: boolean;
    reset_tools: boolean;
    reset_setup: boolean;
}>;

const resetOrganization = async (dto: ResetOrganizationPayload) => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.post(API_URLS.resetOrganization, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useResetOrganization = (): UseMutationResult<
    unknown,
    AxiosError,
    ResetOrganizationPayload
> => {
    return useMutation<unknown, AxiosError, ResetOrganizationPayload>(
        resetOrganization
    );
};
