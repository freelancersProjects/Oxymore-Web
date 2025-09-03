import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { UserStatsData } from '../../hooks/useUserStats';

interface UserStatsProps {
  statsData: UserStatsData | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  className?: string;
}

const UserStats = ({ statsData, isRefreshing, onRefresh, className = '' }: UserStatsProps) => {
  const stats = [
    {
      title: 'Total Users',
      value: statsData?.current.totalUsers.toString() || '0',
      change: statsData?.changes.totalUsers || { value: 0, trend: 'neutral' },
      color: 'bg-gradient-blue'
    },
    {
      title: 'Verified Users',
      value: statsData?.current.verifiedUsers.toString() || '0',
      change: statsData?.changes.verifiedUsers || { value: 0, trend: 'neutral' },
      color: 'bg-gradient-purple'
    },
    {
      title: 'Premium Users',
      value: statsData?.current.premiumUsers.toString() || '0',
      change: statsData?.changes.premiumUsers || { value: 0, trend: 'neutral' },
      color: 'bg-gradient-oxymore'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Statistiques</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
              <div className={`flex items-center gap-1 ${
                stat.change.trend === 'up' ? 'stat-trend-up' :
                stat.change.trend === 'down' ? 'stat-trend-down' :
                'text-gray-400'
              }`}>
                {stat.change.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> :
                 stat.change.trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> :
                 null}
                <span className="text-sm font-medium">
                  {stat.change.value > 0 ? `${stat.change.value.toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStats;
