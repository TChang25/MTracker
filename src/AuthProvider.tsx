// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
    user: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check if the user is authenticated when the app loads
        const checkAuth = async () => {
            const response = await fetch(baseUrl + '/api/verify', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user.name); // Assuming your API returns the username
                setIsAuthenticated(true);
                console.log('This user ' + data.user.name + ' is authenticated!');
                setLoading(false);
            }
            else{
                console.log('User is not authenticated');
                setLoading(false);
            }
            
            
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true); 
        const response = await fetch(baseUrl + '/api/login', {
            method: 'POST',
            credentials: 'include', // Include credentials for cookie handling
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.username);
            setIsAuthenticated(true);
            setLoading(false);
        } else {
            setLoading(false); 
            throw new Error('Login failed');
        }
        
    };

    const logout = async () => {
        setLoading(true);
        const response = await fetch(baseUrl + '/api/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            setUser(null);
            setIsAuthenticated(false);
        } else {
            throw new Error('Logout failed');
        }
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
