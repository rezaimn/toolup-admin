/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';

export type EditToolConfigPayload = {
    toolId: string;
    url: string;
};

const editToolConfig = async ({ toolId, ...dto }: EditToolConfigPayload) => {
    try {
        const { data } = await http.post(
            API_URLS.editToolConfig(toolId.toString()),
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.errors?.detail || error?.message;
    }
};

export const useEditToolConfig = (): UseMutationResult<
    any,
    unknown,
    EditToolConfigPayload,
    void
> => {
    return useMutation(editToolConfig);
};
