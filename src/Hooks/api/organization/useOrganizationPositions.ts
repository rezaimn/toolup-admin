/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery } from 'react-query';

export type OrganizationPosition = {
    position: string;
    members_count: number;
};

const getOrganizationPositions = async () => {
    try {
        const { data } = await http.get(API_URLS.organizationPositions);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useOrganizationPositions = () => {
    return useQuery<OrganizationPosition[]>(
        API_URLS.organizationPositions,
        getOrganizationPositions
    );
};
