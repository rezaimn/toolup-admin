/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
import { toString } from 'lodash/fp';

export type EditMemberAvatarPayload = {
    memberId: number;
    avatar: any;
};

const editMemberAvatar = async (dto: EditMemberAvatarPayload) => {
    try {
        // const payload = { icon: dto.icon };
        const bodyFormData = new FormData();
        bodyFormData.append('avatar', dto.avatar);

        const { data } = await http.post(
            API_URLS.memberAvatar(toString(dto.memberId)),
            bodyFormData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useEditMemberAvatar = (): UseMutationResult<
    any,
    unknown,
    EditMemberAvatarPayload,
    void
> => {
    return useMutation(editMemberAvatar, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
