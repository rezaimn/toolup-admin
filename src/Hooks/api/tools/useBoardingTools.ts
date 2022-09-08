/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery, UseQueryResult } from 'react-query';
import { DeepPartial } from 'redux';

export type BoardingTool = {
    boarding_count: number;
    config: null;
    created_at: string;
    icon: string;
    id: number;
    name: string;
    organization_id: null;
    origin: string;
    type: null;
    updated_at: string;
    url: string;
};

type Payload = DeepPartial<{
    member_position: string;
    member_status: string;
    team_id: number | string;
    search_term: string;
    member_tools_status?: 'NOT_OFFBOARDED' | 'NOT_ONBOARDED';
}>;

const getBoardingTools = async (payload: Payload) => {
    try {
        const { data } = await http.post(API_URLS.boardingTools, payload);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useBoardingTools = (
    payload: Payload
): UseQueryResult<BoardingTool[], unknown> => {
    return useQuery<BoardingTool[]>(
        [API_URLS.boardingTools, payload.member_tools_status],
        () => getBoardingTools(payload)
    );
};
