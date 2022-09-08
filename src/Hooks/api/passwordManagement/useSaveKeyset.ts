/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';
import { DeepPartial } from 'react-hook-form';

export type SaveKeysetPayload = DeepPartial<{
    enc_priv_key: {
        cty: string;
        data: string;
        enc: string;
        iv: string;
        // kid: string;
    };
    enc_sym_key: {
        alg: string;
        cty: string;
        data: string;
        enc: string;
        iv: string;
        // kid: string;
        p2c: number;
        p2s: string;
    };
    pub_key: {
        alg: string;
        e: string;
        ext: boolean;
        key_ops: string[];
        // kid: string;
        kty: string;
        n: string;
    };
}>;

export type SaveKeysetReturnData = SaveKeysetPayload;

export const saveKeyset = async (dto: SaveKeysetPayload) => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.post(
            API_URLS.passwordManagement.keyset,
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useSaveKeyset = (): UseMutationResult<
    SaveKeysetReturnData,
    AxiosError,
    SaveKeysetPayload
> => {
    return useMutation<SaveKeysetReturnData, AxiosError, SaveKeysetPayload>(
        saveKeyset
    );
};
