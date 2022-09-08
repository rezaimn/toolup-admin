/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery } from 'react-query';
import { EarlyAdaptionRegisterProps } from './useEarlyAdaptionRegister';

type EarlyAdaptionProps = {
    token: string;
};

const getEarlyAdaption = async (dto: EarlyAdaptionProps) => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.post(API_URLS.earlyAdaption, dto, {
            shouldAuthenticate: false,
        });
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useEarlyAdaption = (dto: EarlyAdaptionProps) => {
    return useQuery<EarlyAdaptionRegisterProps[]>(
        [API_URLS.membersFilter],
        () => getEarlyAdaption(dto)
    );
};
