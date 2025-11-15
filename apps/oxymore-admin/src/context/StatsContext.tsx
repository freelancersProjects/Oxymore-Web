import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../api/apiService';

interface Stats {
  totalUsers: number;
  totalTournaments: number;
  totalTeams: number;
  totalLeagues: number;
  activeMatches: number;
  activeUsers: number;
  totalCashPrize: number;
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
  cash_prize?: number;
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
    activeUsers: 0,
    totalCashPrize: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Récupérer les données en parallèle
      const [usersResponse, tournamentsResponse, teamsResponse, leaguesResponse, activeUsersResponse] = await Promise.all([
        apiService.get<User[]>('/users'),
        apiService.get<Tournament[]>('/tournaments'),
        apiService.get<Team[]>('/teams'),
        apiService.get<League[]>('/leagues'),
        apiService.get<{ activeUsers: number }>('/stats/active-users')
      ]);

      const users = usersResponse || [];
      const tournaments = tournamentsResponse || [];
      const teams = teamsResponse || [];
      const leagues = leaguesResponse || [];
      const activeUsers = activeUsersResponse?.activeUsers || 0;

      // Calculer le total du cash prize des tournois
      const totalCashPrize = tournaments.reduce((sum, tournament) => {
        return sum + (tournament.cash_prize || 0);
      }, 0);

      setStats({
        totalUsers: users.length,
        totalTournaments: tournaments.length,
        totalTeams: teams.length,
        totalLeagues: leagues.length,
        activeMatches: 24,
        activeUsers: activeUsers,
        totalCashPrize
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
