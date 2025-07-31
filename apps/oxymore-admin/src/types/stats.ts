// Interfaces pour les statistiques

export interface DashboardStats {
  totalUsers: number;
  totalTournaments: number;
  totalTeams: number;
  totalMatches: number;
  activeTournaments: number;
  upcomingMatches: number;
  recentSignups: number;
  totalPrizePool: number;
}

export interface TournamentStats {
  id: number;
  name: string;
  registrations: number;
  matches_played: number;
  matches_total: number;
  prize_pool: number;
  status: string;
}

export interface UserActivity {
  user_id: number;
  username: string;
  action: string;
  timestamp: string;
  details?: any;
}

export interface AdminNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}
