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
          // Idéalement, ici on ferait un appel à une route /api/auth/profile
          // pour valider le token et récupérer les données fraîches.
          // Pour l'instant, on décode le token pour récupérer les données utilisateur
          // stockées lors de la connexion, si elles existent.
          const storedUser = localStorage.getItem('useroxm');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // S'assurer que l'objet a id_user
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
        } catch (error) {
          console.error("Failed to authenticate with token", error);
          localStorage.removeItem('token');
          localStorage.removeItem('useroxm');
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
