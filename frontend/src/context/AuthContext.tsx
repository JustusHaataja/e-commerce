import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as authApi from '../api/auth';

interface AuthContextType {
    user: authApi.User | null;
    loading: boolean;
    login: (credentials: authApi.LoginCredentials) => Promise<void>;
    register: (data: authApi.RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<authApi.User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const user = await authApi.getCurrentUser();
            setUser(user);
        } catch (error) {
            // Not logged in
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: authApi.LoginCredentials) => {
        await authApi.login(credentials);
        await checkUser();
    };

    const register = async (data: authApi.RegisterData) => {
        await authApi.register(data);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        // Trigger a custom event that CartContext can listen to
        window.dispatchEvent(new Event('user-logged-out'));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
