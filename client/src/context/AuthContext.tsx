import React, { createContext, useState, useEffect, useContext } from 'react';
import { logoutRequest, validateAuthRequest } from '../api/services/auth';

interface AuthContextProps {
    isAuthenticated: boolean;
    user: any;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    const validateUser = async () => {
        try {
            const res = await validateAuthRequest();
            if (res.status === 200) {
                setIsAuthenticated(true);
                setUser(res.data.data);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            console.error('Validation error:', error);
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        validateUser();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
