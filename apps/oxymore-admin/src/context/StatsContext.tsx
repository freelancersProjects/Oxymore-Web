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
      const [users, tournaments, teams, leagues] = await Promise.all([
        apiService.get('/users'),
        apiService.get('/tournaments'),
        apiService.get('/teams'),
        apiService.get('/leagues')
      ]);

      setStats({
        totalUsers: (users as any[]).length,
        totalTournaments: (tournaments as any[]).length,
        totalTeams: (teams as any[]).length,
        totalLeagues: (leagues as any[]).length,
        activeMatches: 24, // Pour l'instant, on garde une valeur fixe
        activeUsers: Math.floor((users as any[]).length * 0.1) // 10% des utilisateurs actifs
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
