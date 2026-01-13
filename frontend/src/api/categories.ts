import { getJSON } from './apiClient';

export interface Category {
    id: number;
    name: string;
}

export const fetchCategories = async (signal?: AbortSignal): Promise<Category[]> => {
    return await getJSON<Category[]>("/products/categories", signal);
}