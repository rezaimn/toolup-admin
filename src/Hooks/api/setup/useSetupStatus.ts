/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { UseQueryResult, useQuery, UseQueryOptions } from 'react-query';
import { AxiosError } from 'axios';

type SetupStatus = {
    setup_process_step: string;
    setup_finished: boolean;
    send_bulk_invitation_emails: boolean | undefined;
};

const getSetupStatus = async () => {
    try {
        const { data } = await http.get(API_URLS.setupStatus);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useSetupStatus = (
    options?: UseQueryOptions<SetupStatus, AxiosError>
): UseQueryResult<SetupStatus, AxiosError> => {
    return useQuery(API_URLS.setupStatus, getSetupStatus, options);
};
