/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';

export type mailServiceData = {
    tool_id?: string;
    url?: string;
    config?: {
        domain: [];
    };
};

const updateMailService = async (body: mailServiceData) => {
    try {
        const { data } = await http.put(API_URLS.singleMailService, body);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors?.message || error.message;
    }
};

export const useMailServiceUpdate = () => {
    return useMutation(updateMailService, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
