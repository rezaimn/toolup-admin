/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Member } from './useFilterMembers';

const getAllMembers = async () => {
    try {
        const { data } = await http.get(API_URLS.allMembers);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useAllMembers = (
    options?: UseQueryOptions<Member[]>
): UseQueryResult<Member[]> => {
    return useQuery<Member[]>(API_URLS.allMembers, getAllMembers, options);
};
