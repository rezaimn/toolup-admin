/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery } from 'react-query';

export type TeamHttpResponse = {
    id: number;
    name: string;
    organization_id: number;
    created_at: string;
    updated_at: string;
    members_count: number;
    color: string;
    tools: any[];
};

export const getTeams = async (): Promise<TeamHttpResponse[]> => {
    try {
        const { data } = await http.get(API_URLS.allTeams);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useAllTeams = () => {
    return useQuery<TeamHttpResponse[]>(API_URLS.allTeams, getTeams);
};
