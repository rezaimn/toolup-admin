/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation, UseMutationResult } from 'react-query';

export type EditToolImagePayloadProps = {
    toolId: number;
    icon: any;
};

const editToolImage = async (dto: EditToolImagePayloadProps) => {
    try {
        // const payload = { icon: dto.icon };
        const bodyFormData = new FormData();
        bodyFormData.append('icon', dto.icon);
        const { data } = await http.post(
            API_URLS.editToolImage.replace('__id__', dto.toolId.toString()),
            bodyFormData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useEditToolImage = (): UseMutationResult<
    any,
    unknown,
    EditToolImagePayloadProps,
    void
> => {
    return useMutation(editToolImage, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
