/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, useQuery } from 'react-query';
import { Team } from '../../../Store/team/models/Team';
import { Member } from '../../../Store/member/models/Member';
import { AxiosResponse } from 'axios';

const getUserById = async (id: any) => {
    const { data } = await http.get(API_URLS.users + '/' + id);
    return data;
};
export const useGetUserById = (id: any) => {
    return useQuery<Member>(API_URLS.users, () => getUserById(id));
};

const updateUser = async (body: any) => {
    const { data } = await http.put(`${API_URLS.users}/${body.id}`, body);
    return data;
};
export const useUpdateUser = () => {
    return useMutation(updateUser);
};

export type ChangeAvatarDto = {
    avatar: FormData;
    userId: any;
};

type ChangeAvatarResult = {
    file_name: string;
    full_path: string;
};

const changeMemberAvatar = async (dto: ChangeAvatarDto) => {
    try {
        const { data } = await http.post<
            ChangeAvatarDto,
            AxiosResponse<ChangeAvatarResult>
        >(API_URLS.users + '/' + dto.userId + '/avatar', dto.avatar, {
            shouldHandleInGlobalLevel: true,
        });

        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};
export const useChangeMemberAvatar = () => {
    return useMutation(changeMemberAvatar);
};

const createUser = async (body: Member) => {
    const { data } = await http.post(API_URLS.users, body);
    return data;
};
export const useCreateUser = () => {
    return useMutation(createUser, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};

const bulkDeleteUser = async (userIds: number[]) => {
    const { data } = await http.post(API_URLS.memberBulkDelete, {
        member_ids: userIds,
    });
    return data;
};
export const useBulkDeleteUser = () => {
    return useMutation(bulkDeleteUser);
};

const memberStatus = async (body: any) => {
    const { data } = await http.post(
        API_URLS.users + '/' + body.userId + '/status',
        body.data
    );
    return data;
};
export const useMemberStatus = () => {
    return useMutation(memberStatus);
};

const sendInvitationEmail = async (body: any) => {
    const { data } = await http.post(
        API_URLS.users + '/' + body.userId + '/invite'
    );
    return data;
};
export const useSendInvitationEmail = () => {
    return useMutation(sendInvitationEmail);
};

const deleteUser = async (body: any) => {
    const { data } = await http.delete(API_URLS.users + '/' + body.userId);
    return data;
};
export const useDeleteUser = () => {
    return useMutation(deleteUser);
};
/* usage example  */

/*
export default function UsersPage() {
    const {data, isLoading} = useUsers();
    return (
    )
}
 */
