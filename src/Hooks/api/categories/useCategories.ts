/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useQuery } from 'react-query';

export type CategoriesHttpResponse = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
};

const getCategories = async () => {
    try {
        const { data } = await http.get(API_URLS.categories);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useCategories = () => {
    return useQuery<CategoriesHttpResponse[]>(
        API_URLS.categories,
        getCategories
    );
};
