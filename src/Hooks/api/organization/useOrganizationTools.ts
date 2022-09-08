/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { QueryObserverResult, useQuery } from 'react-query';
import { Tool } from '../tools';

const getOrganizationTools = async () => {
    try {
        const { data } = await http.get(API_URLS.organizationTools);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useOrganizationTools = (): QueryObserverResult<
    Tool[],
    unknown
> => {
    return useQuery<Tool[]>(API_URLS.organizationTools, getOrganizationTools);
};
