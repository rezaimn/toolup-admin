/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import { toString } from 'lodash/fp';

export type GrantVaultAccessPayload = {
    vaultId: number;
    enc_vault_key: VaultKey;
};
type VaultKey = {
    cty: string;
    data: string;
    enc: string;
};
export type GrantVaultAccessReturnData = {
    member_id: number;
    vault_id: number;
    enc_vault_key: VaultKey;
    updated_at: string;
    created_at: string;
    id: number;
};

export const grantVaultAccess = async ({
    vaultId,
    ...dto
}: GrantVaultAccessPayload) => {
    try {
        const { data } = await http.post(
            API_URLS.passwordManagement.grantVaultAccess(toString(vaultId)),
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

export const useGrantVaultAccess = (): UseMutationResult<
    GrantVaultAccessReturnData,
    AxiosError,
    GrantVaultAccessPayload,
    unknown
> => {
    return useMutation(grantVaultAccess, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
