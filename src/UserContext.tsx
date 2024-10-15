// UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {useAuth } from './AuthProvider'; // Adjust the import path as needed

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Fetch isAuthenticated from AuthProvider
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
            const response = await fetch(baseUrl + '/api/user', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data:UserData = await response.json();
            console.log(data);
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
      } else {
            setUser(null);
            setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

    return (
        <UserContext.Provider value={{ user, loading }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};


