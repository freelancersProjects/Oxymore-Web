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
  xp_total: number;
  wallet?: number | null;
  country_code: string;
  discord_tag: string;
  faceit_id: string;
  verified: boolean;
  created_at: string;
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
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to authenticate with token", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = ({ user, token }: { user: User; token: string }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // On stocke aussi l'user pour le récupérer au rechargement
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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