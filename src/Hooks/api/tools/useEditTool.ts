/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';

export type EditToolPayload = {
    name: string;
    url: string;
    toolId: number;
};

const editTool = async ({ toolId, ...dto }: EditToolPayload) => {
    try {
        const { data } = await http.patch(
            API_URLS.editTool(toolId.toString()),
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useEditTool = (): UseMutationResult<
    any,
    unknown,
    EditToolPayload,
    void
> => {
    return useMutation(editTool, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
