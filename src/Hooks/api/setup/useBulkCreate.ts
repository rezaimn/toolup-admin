/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';

export type BulkData = {
    members_file: string;
    options: {
        system_setup_step: string;
    };
};

const createBulkData = async (body: BulkData) => {
    try {
        const { data } = await http.post(API_URLS.createBulk, body);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors?.message || error.message;
    }
};

export const useCreateBulkData = () => {
    return useMutation(createBulkData, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
