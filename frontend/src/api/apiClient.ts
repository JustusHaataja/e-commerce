import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    withCredentials: true
});

export default apiClient;

export const getJSON = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
    try {
        const res = await apiClient.get<T>(url, { signal });
        return res.data;
    } catch (err: unknown) {
        if (axios.isCancel(err)) {
            return Promise.resolve(undefined as unknown as T);
        }
        throw err;
    }
}