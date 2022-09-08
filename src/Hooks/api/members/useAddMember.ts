/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { Member } from './useFilterMembers';

export type AddMemberPayload = {
    first_name: string;
    last_name: string;
    email: string;
    onboarding_date: Date | string;
    status: string;
};

const addMember = async (dto: AddMemberPayload) => {
    try {
        const { data } = await http.post(API_URLS.members, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

export const useAddMember = (): UseMutationResult<
    Member,
    any,
    AddMemberPayload,
    void
> => {
    return useMutation(addMember, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
