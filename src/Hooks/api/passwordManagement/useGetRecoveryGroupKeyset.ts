/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { toString } from 'lodash/fp';

export type GetRecoveryGroupKeysetPayload = {
    userId: number;
};

export type GetRecoveryGroupKeysetReturnData = {
    id: number;
    name: string;
    uuid: string;
    organization_id: number;
    pub_key: {
        alg: string;
        e: string;
        ext: true;
        key_ops: ['encrypt'];
        kid: string;
        kty: string;
        n: string;
    };
    created_at: string;
    updated_at: string;
    enc_priv_key: {
        cty: string;
        data: string;
        enc: string;
        iv: string;
        kid: string;
    };
};

export const getRecoveryGroupKeyset = async ({
    userId,
}: GetRecoveryGroupKeysetPayload): Promise<GetRecoveryGroupKeysetReturnData> => {
    try {
        const { data } = await http.get(
            API_URLS.passwordManagement.recoveryGroupKeysets(toString(userId))
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

/* export const useGetRecoveryGroupKeyset = (): UseMutationResult<
    GetRecoveryGroupKeysetReturnData,
    unknown,
    GetRecoveryGroupKeysetPayload,
    void
> => {
    return useMutation(getRecoveryGroupKeyset, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
 */
