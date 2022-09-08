/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
/* helpers */

type CheckPasswordProps = {
    password: string;
};

const checkPassword = async (dto: CheckPasswordProps) => {
    try {
        const { data } = await http.post(API_URLS.checkPassword, dto);
        return data;
    } catch (e) {
        throw e?.response?.data.errors || e.message;
    }
};

export const useCheckPassword = () => {
    return useMutation(checkPassword, {
        onSuccess: () => {},
        onError: () => {},
        onMutate: () => {},
        onSettled: () => {},
    });
};
