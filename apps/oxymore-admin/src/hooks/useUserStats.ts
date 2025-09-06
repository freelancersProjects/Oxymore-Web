import { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  premiumUsers: number;
  adminUsers: number;
}

export interface UserStatsChange {
  value: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface UserStatsData {
  current: UserStats;
  changes: {
    totalUsers: UserStatsChange;
    verifiedUsers: UserStatsChange;
    premiumUsers: UserStatsChange;
    adminUsers: UserStatsChange;
  };
}

export const useUserStats = () => {
  const [statsData, setStatsData] = useState<UserStatsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await apiService.get<{ data: UserStatsData }>('/users/stats');
      setStatsData(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Erreur lors de la récupération des statistiques');
    }
  };

  const refreshStats = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      // Forcer le rafraîchissement côté serveur
      await apiService.post('/users/stats/refresh', {});

      // Attendre un peu pour s'assurer que le serveur a traité
      await new Promise(resolve => setTimeout(resolve, 200));

      // Récupérer les nouvelles stats
      await fetchStats();
    } catch (error) {
      console.error('Error refreshing stats:', error);
      setError('Erreur lors du rafraîchissement des statistiques');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Récupérer les stats au chargement
  useEffect(() => {
    fetchStats();
  }, []);

  // Rafraîchir les stats quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      fetchStats();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    statsData,
    isRefreshing,
    error,
    fetchStats,
    refreshStats
  };
};
