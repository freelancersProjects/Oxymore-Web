import { db } from "../config/db";

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  premiumUsers: number;
  adminUsers: number;
  timestamp: Date;
}

export interface UserStatsComparison {
  current: UserStats;
  previous: UserStats | null;
  changes: {
    totalUsers: { value: number; trend: 'up' | 'down' | 'neutral' };
    verifiedUsers: { value: number; trend: 'up' | 'down' | 'neutral' };
    premiumUsers: { value: number; trend: 'up' | 'down' | 'neutral' };
    adminUsers: { value: number; trend: 'up' | 'down' | 'neutral' };
  };
}

class UserStatsService {
  private static instance: UserStatsService;
  private lastStats: UserStats | null = null;

  private constructor() {}

  public static getInstance(): UserStatsService {
    if (!UserStatsService.instance) {
      UserStatsService.instance = new UserStatsService();
    }
    return UserStatsService.instance;
  }

  /**
   * Calcule les statistiques actuelles des utilisateurs
   */
  public async calculateCurrentStats(): Promise<UserStats> {
    try {
             const [users] = await db.execute(`
         SELECT
           COUNT(*) as totalUsers,
           COUNT(CASE WHEN verified = 1 THEN 1 END) as verifiedUsers,
           COUNT(CASE WHEN is_premium = 1 THEN 1 END) as premiumUsers,
           COUNT(CASE WHEN role_id = 1 THEN 1 END) as adminUsers
         FROM user
       `);

       const stats = (users as any[])[0] as any;
      const currentStats: UserStats = {
        totalUsers: stats.totalUsers || 0,
        verifiedUsers: stats.verifiedUsers || 0,
        premiumUsers: stats.premiumUsers || 0,
        adminUsers: stats.adminUsers || 0,
        timestamp: new Date()
      };

      return currentStats;
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw new Error('Failed to calculate user statistics');
    }
  }

  /**
   * Calcule les changements par rapport aux statistiques précédentes
   */
  public async getStatsWithComparison(): Promise<UserStatsComparison> {
    const currentStats = await this.calculateCurrentStats();
    const previousStats = this.lastStats;

    // Calculer les changements
    const changes = {
      totalUsers: this.calculateChange(currentStats.totalUsers, previousStats?.totalUsers || 0),
      verifiedUsers: this.calculateChange(currentStats.verifiedUsers, previousStats?.verifiedUsers || 0),
      premiumUsers: this.calculateChange(currentStats.premiumUsers, previousStats?.premiumUsers || 0),
      adminUsers: this.calculateChange(currentStats.adminUsers, previousStats?.adminUsers || 0)
    };

    // Mettre à jour les dernières stats pour la prochaine comparaison
    this.lastStats = currentStats;

    return {
      current: currentStats,
      previous: previousStats,
      changes
    };
  }

  /**
   * Calcule le pourcentage de changement entre deux valeurs
   */
  private calculateChange(current: number, previous: number): { value: number; trend: 'up' | 'down' | 'neutral' } {
    if (previous === 0) {
      return {
        value: current > 0 ? 100 : 0,
        trend: current > 0 ? 'up' : 'neutral'
      };
    }

    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  }

    /**
   * Force la mise à jour des statistiques (utile après des opérations CRUD)
   */
  public async refreshStats(): Promise<UserStatsComparison> {
    // Sauvegarder les stats actuelles comme "précédentes" avant de recalculer
    const currentStats = await this.calculateCurrentStats();
    this.lastStats = currentStats;

    // Recalculer les nouvelles stats
    const newStats = await this.calculateCurrentStats();

    // Calculer les changements
    const changes = {
      totalUsers: this.calculateChange(newStats.totalUsers, currentStats.totalUsers),
      verifiedUsers: this.calculateChange(newStats.verifiedUsers, currentStats.verifiedUsers),
      premiumUsers: this.calculateChange(newStats.premiumUsers, currentStats.premiumUsers),
      adminUsers: this.calculateChange(newStats.adminUsers, currentStats.adminUsers)
    };

    // Mettre à jour les dernières stats
    this.lastStats = newStats;

    return {
      current: newStats,
      previous: currentStats,
      changes
    };
  }
}

export default UserStatsService;
