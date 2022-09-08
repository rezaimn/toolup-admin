/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { SetupStep } from './useSetupStep';

const updateSetupStep = async (body: SetupStep) => {
    try {
        const { data } = await http.put(API_URLS.setupStatus, body);
        return data;
    } catch (error) {
        throw error?.response?.data?.errors?.message || error.message;
    }
};

export const useUpdateSetupStep = () => {
    return useMutation(updateSetupStep, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
