/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosError } from 'axios';

export type AddDevicePayload = Partial<{
    client: string;
    client_version: string;
    user_agent: string;
    os_name: string;
    os_version: string;
    device_model: string;
    device_type: string;
    device_vendor: string;
    uuid: string;
}>;

export type AddDeviceReturnData = {
    member_id: number;
    uuid: string;
    client: string;
    client_version: string;
    user_agent: string;
    os_name: string;
    os_version: string;
    last_used: string;
    last_ip: string;
    updated_at: string;
    created_at: string;
    id: number;
};

export const addDevice = async (dto: AddDevicePayload) => {
    try {
        const { data } = await http.post(
            API_URLS.passwordManagement.devices,
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.errors || error?.message;
    }
};

export const useAddDevice = (): UseMutationResult<
    AddDeviceReturnData,
    AxiosError,
    AddDevicePayload,
    void
> => {
    return useMutation(addDevice, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
