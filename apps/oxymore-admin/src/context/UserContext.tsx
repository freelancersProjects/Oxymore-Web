import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserContextType } from '../types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const mockUser: User = {
          id_user: "123",
          first_name: "John",
          last_name: "Doe",
          username: "johndoe",
          email: "john@example.com",
          password_hash: "hashed_password",
          is_premium: true,
          avatar_url: "https://example.com/avatar.jpg",
          banner_url: "https://example.com/banner.jpg",
          bio: "CS2 Player",
          elo: 1500,
          wallet: 100.00,
          country_code: "FR",
          role_id: "user_role",
          online_status: "online",
          last_seen: new Date().toISOString(),
          discord_link: "discord.gg/user",
          faceit_id: "faceit123",
          steam_link: "steamcommunity.com/id/user",
          twitch_link: "twitch.tv/user",
          youtube_link: "youtube.com/@user",
          verified: true,
          created_at: new Date().toISOString(),
          team_chat_is_muted: false
        };

        setUser(mockUser);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        error,
        logout,
        updateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
