/* services */
import { http } from 'Http/api';
import { queryClient } from 'Services/ReactQueryService';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { useOrganization } from './useOrganization';

type ChangeLogoDto = {
    logo: FormData;
};

type ChangeLogoResult = {
    file_name: string;
    full_path: string;
};

const changeLogo = async (dto: ChangeLogoDto) => {
    try {
        const { data } = await http.post<
            ChangeLogoDto,
            AxiosResponse<ChangeLogoResult>
        >(API_URLS.changeLogo, dto.logo, {
            shouldHandleInGlobalLevel: true,
        });

        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useChangeLogo = () => {
    return useMutation(changeLogo, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(API_URLS.organization);
        },
    });
};
