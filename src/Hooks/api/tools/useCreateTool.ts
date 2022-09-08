/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';

export type CreateToolPayloadProps = {
    name: string;
    url: string;
    categories: string[];
};

const createTool = async (dto: CreateToolPayloadProps) => {
    try {
        const { data } = await http.post(API_URLS.createTool, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors?.detail || error?.message;
    }
};

export const useCreateTool = () => {
    return useMutation(createTool, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
