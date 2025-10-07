import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.user;

            if (userData.id && !userData.id_user) {
              const mappedUser: User = {
                ...userData,
                id_user: userData.id,
              };
              setUser(mappedUser);
            } else {
              setUser(userData);
            }
          } else {
            const storedUser = localStorage.getItem('useroxm');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.id && !parsedUser.id_user) {
                const mappedUser: User = {
                  ...parsedUser,
                  id_user: parsedUser.id,
                };
                setUser(mappedUser);
              } else {
                setUser(parsedUser);
              }
            }
          }
        } catch (error) {
          console.error("Failed to authenticate with token", error);
          const storedUser = localStorage.getItem('useroxm');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser.id_user) {
              const mappedUser: User = {
                ...parsedUser,
                id_user: parsedUser.id,
              };
              setUser(mappedUser);
            } else {
              setUser(parsedUser);
            }
          }
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = ({ user, token }: { user: any; token: string }) => {
    const mappedUser: User = {
      ...user,
      id_user: user.id,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('useroxm', JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('useroxm');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
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
