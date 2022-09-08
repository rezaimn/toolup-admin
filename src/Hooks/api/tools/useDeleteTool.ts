/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';

export type DeleteToolPayload = {
    toolId: number;
};

const deleteTool = async ({ toolId }: DeleteToolPayload) => {
    try {
        const { data } = await http.delete(
            API_URLS.deleteTool(toolId.toString())
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useDeleteTool = (): UseMutationResult<
    unknown,
    unknown,
    DeleteToolPayload,
    void
> => {
    return useMutation(deleteTool, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
