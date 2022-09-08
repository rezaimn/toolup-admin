import API_URLS from 'Constants/apiUrls';
import { http } from 'Http/api';
import { SaveKeysetPayload, SaveKeysetReturnData } from './useSaveKeyset';

export const createRecoveryGroup = async (dto: {
    keyset: SaveKeysetPayload;
}): Promise<SaveKeysetReturnData> => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.post(
            API_URLS.passwordManagement.recoveryGroup,
            dto
        );
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};
