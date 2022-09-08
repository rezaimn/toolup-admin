/* services */
import { http } from 'Http/api';
import { queryClient } from 'Services/ReactQueryService';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';

type ChangeAvatarDto = {
    avatar: FormData;
};

type ChangeAvatarResult = {
    file_name: string;
    full_path: string;
};

const changeAvatar = async (dto: ChangeAvatarDto) => {
    try {
        const { data } = await http.post<
            ChangeAvatarDto,
            AxiosResponse<ChangeAvatarResult>
        >(API_URLS.changeAvatar, dto.avatar, {
            shouldHandleInGlobalLevel: true,
        });

        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useChangeAvatar = () => {
    return useMutation(changeAvatar, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(API_URLS.user);
        },
    });
};
