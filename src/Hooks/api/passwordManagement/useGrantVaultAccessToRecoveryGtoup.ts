/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import { toString } from 'lodash/fp';
import {
    GrantVaultAccessPayload,
    GrantVaultAccessReturnData,
} from './useGrantVaultAccess';

export const grantVaultAccessToRecoveryGroup = async ({
    vaultId,
    ...dto
}: GrantVaultAccessPayload): Promise<GrantVaultAccessReturnData> => {
    try {
        const { data } = await http.post(
            API_URLS.passwordManagement.grantVaultAccessToRecoveryGroup(
                toString(vaultId)
            ),
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

/* export const useGrantVaultAccess = (): UseMutationResult<
    GrantVaultAccessReturnData,
    AxiosError,
    GrantVaultAccessPayload,
    unknown
> => {
    return useMutation(grantVaultAccessToRecoveryGroup, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
 */
