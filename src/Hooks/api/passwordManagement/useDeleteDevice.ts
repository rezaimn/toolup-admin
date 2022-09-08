/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { toString } from 'lodash/fp';
import { AxiosError } from 'axios';
import { queryClient } from 'Services/ReactQueryService';

export type DeleteDevicePayload = {
    deviceId: number;
};

const deleteDevice = async ({ deviceId }: DeleteDevicePayload) => {
    try {
        const { data } = await http.delete(
            API_URLS.passwordManagement.deleteDevice(toString(deviceId))
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useDeleteDevice = (): UseMutationResult<
    unknown,
    AxiosError,
    DeleteDevicePayload,
    void
> => {
    return useMutation(deleteDevice, {
        onSuccess: () => {
            queryClient.invalidateQueries(API_URLS.passwordManagement.devices);
        },
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
