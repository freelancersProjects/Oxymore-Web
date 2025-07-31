import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../api/apiService';

interface Stats {
  totalUsers: number;
  totalTournaments: number;
  totalTeams: number;
  totalLeagues: number;
  activeMatches: number;
  activeUsers: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
}

interface Tournament {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Team {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
}

interface League {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface StatsContextType {
  stats: Stats;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTournaments: 0,
    totalTeams: 0,
    totalLeagues: 0,
    activeMatches: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Récupérer les données en parallèle
      const [usersResponse, tournamentsResponse, teamsResponse, leaguesResponse] = await Promise.all([
        apiService.get<User[]>('/users'),
        apiService.get<Tournament[]>('/tournaments'),
        apiService.get<Team[]>('/teams'),
        apiService.get<League[]>('/leagues')
      ]);

      const users = usersResponse || [];
      const tournaments = tournamentsResponse || [];
      const teams = teamsResponse || [];
      const leagues = leaguesResponse || [];

      setStats({
        totalUsers: users.length,
        totalTournaments: tournaments.length,
        totalTeams: teams.length,
        totalLeagues: leagues.length,
        activeMatches: 24, // Pour l'instant, on garde une valeur fixe
        activeUsers: Math.floor(users.length * 0.1) // 10% des utilisateurs actifs
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
