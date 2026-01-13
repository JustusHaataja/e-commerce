import apiClient from './apiClient';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const login = async (credentials: LoginCredentials): Promise<void> => {
    await apiClient.post('/auth/login', credentials);
};

export const register = async (data: RegisterData): Promise<void> => {
    await apiClient.post('/auth/register', data);
};

export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
};
