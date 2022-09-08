/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { isInSetupProcess } from 'Helpers/isInSetupProcess';

type PayloadProps = {
    teamId: number;
    toolIds: number[];
    status?: string;
};

/* REVIEW @mahmood.b move this part as props */

const addTeamTool = async (dto: PayloadProps) => {
    try {
        const status = isInSetupProcess() ? 'ONBOARDED' : 'NOT_ONBOARDED';

        const { teamId } = dto;
        const payload = {
            tool_ids: dto.toolIds,
            member_tools_status: dto.status || status,
        };
        const url = API_URLS.addTool.replace('__id__', teamId.toString());
        const { data } = await http.put(url, payload);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useAddTeamTool = () => {
    return useMutation(addTeamTool, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
