/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Tool } from 'Hooks/api/tools/useUserTools';

const getMailServices = async () => {
    const url = API_URLS.mailService;
    try {
        const { data } = await http.get(url);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useMailServices = (
    options?: UseQueryOptions<Tool[]>
): UseQueryResult<Tool[]> => {
    const queryKey = API_URLS.mailService;
    return useQuery<Tool[]>(queryKey, () => getMailServices(), options);
};
