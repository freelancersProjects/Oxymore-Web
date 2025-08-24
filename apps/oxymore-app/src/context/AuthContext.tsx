import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Basé sur le userModel du backend, sans le password_hash
interface User {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_premium: boolean;
  avatar_url: string;
  banner_url: string;
  bio: string;
  elo: number;
  wallet?: number | null;
  country_code: string;
  discord_link: string;
  faceit_id: string;
  steam_link: string;
  twitch_link: string;
  youtube_link: string;
  verified: boolean;
  created_at: string;
  team_chat_is_muted: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Récupérer le profil complet depuis l'API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.user;

            // S'assurer que l'objet a id_user
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
            // Si l'API échoue, essayer avec les données stockées
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
          // En cas d'erreur, essayer avec les données stockées
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
    // Mapper l'objet utilisateur pour avoir id_user au lieu de id
    const mappedUser: User = {
      ...user,
      id_user: user.id, // Convertir id en id_user
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
