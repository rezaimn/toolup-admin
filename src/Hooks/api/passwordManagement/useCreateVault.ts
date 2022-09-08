/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';

export type CreateVaultPayload = {
    enc_attrs?: Record<string, unknown>;
    type?: 'TEAM' | 'PERSONAL';
    member_id?: number;
    creator_id?: number;
};

export type CreateVaultReturnData = {
    uuid: string;
    member_id: number;
    updated_at: string;
    created_at: string;
    id: number;
};

export const createVault = async (
    dto: CreateVaultPayload
): Promise<CreateVaultReturnData> => {
    try {
        const { data } = await http.post(
            API_URLS.passwordManagement.vaults,
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

export const useCreateVault = (): UseMutationResult<
    CreateVaultReturnData,
    AxiosError,
    CreateVaultPayload,
    void
> => {
    return useMutation(createVault, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
