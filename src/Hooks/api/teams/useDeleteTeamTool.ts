/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { isInSetupProcess } from 'Helpers/isInSetupProcess';

type PayloadProps = {
    teamId: number;
    toolId: number;
};

const deleteTeamTool = async (dto: PayloadProps) => {
    try {
        const { teamId } = dto;
        /* include force_delete_member_tools true if we were in the setup process page  */
        const payload = {
            tool_id: dto.toolId,
            ...(isInSetupProcess() && { force_delete_member_tools: true }),
        };

        const url = API_URLS.deleteTeamTool(teamId.toString());
        const { data } = await http.put(url, payload);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useDeleteTeamTool = () => {
    return useMutation(deleteTeamTool, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
