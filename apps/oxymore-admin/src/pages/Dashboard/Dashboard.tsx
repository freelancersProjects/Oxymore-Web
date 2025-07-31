import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useStats } from '../../context/StatsContext';

const Dashboard = (): React.JSX.Element => {
  const { stats, loading } = useStats();

  // Fonction pour formater les nombres
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Fonction pour formater les prix
  const formatPrice = (num: number): string => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1) + 'K';
    }
    return '$' + num.toString();
  };

  // Mock data for charts
  const userActivityData = [
    { name: 'Jan', users: 4000 },
    { name: 'Feb', users: 5000 },
    { name: 'Mar', users: 4800 },
    { name: 'Apr', users: 6000 },
    { name: 'May', users: 5500 },
    { name: 'Jun', users: 7000 },
    { name: 'Jul', users: 8000 }
  ];

  const tournamentData = [
    { name: 'CS2', value: 45 },
    { name: 'Valorant', value: 35 },
    { name: 'LoL', value: 30 },
    { name: 'Dota 2', value: 25 },
    { name: 'R6', value: 20 }
  ];

  const upcomingMatches = [
    { team1: 'Team Liquid', team2: 'NAVI', time: '2h', game: 'CS2', prize: '$50,000' },
    { team1: 'Fnatic', team2: 'G2', time: '4h', game: 'Valorant', prize: '$30,000' },
    { team1: 'T1', team2: 'DRX', time: '6h', game: 'LoL', prize: '$40,000' }
  ];

  const recentActivity = [
    { user: 'ProGamer_2023', action: 'Joined tournament "CS2 Major"', time: '2 min ago' },
    { user: 'Team_Alpha', action: 'Registered for league', time: '5 min ago' },
    { user: 'ElitePlayer', action: 'Won match vs Team_Beta', time: '12 min ago' },
    { user: 'NextGenESports', action: 'Created new tournament', time: '1h ago' }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Users',
            value: loading ? '...' : formatNumber(stats.totalUsers),
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: 'bg-gradient-blue'
          },
          {
            title: 'Active Tournaments',
            value: loading ? '...' : stats.totalTournaments.toString(),
            change: '+3',
            trend: 'up',
            icon: Trophy,
            color: 'bg-gradient-purple'
          },
          {
            title: 'Total Prize Pool',
            value: loading ? '...' : formatPrice(stats.totalTournaments * 5000), // Estimation
            change: '-5%',
            trend: 'down',
            icon: DollarSign,
            color: 'bg-gradient-oxymore'
          },
          {
            title: 'Live Matches',
            value: loading ? '...' : stats.activeMatches.toString(),
            change: '+2',
            trend: 'up',
            icon: Activity,
            color: 'bg-[linear-gradient(135deg,#ff6b6b,#ee5253)]'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-[var(--text-secondary)] text-sm">{stat.title}</h3>
              <p className="text-[var(--text-primary)] text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[var(--text-primary)] text-lg font-semibold">User Activity</h2>
            <select className="bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg px-3 py-1 text-sm text-[var(--text-primary)]">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tournament Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[var(--text-primary)] text-lg font-semibold">Tournament Distribution</h2>
            <select className="bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg px-3 py-1 text-sm text-[var(--text-primary)]">
              <option>By Game</option>
              <option>By Region</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tournamentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[var(--text-primary)] text-lg font-semibold">Upcoming Matches</h2>
            <button className="text-oxymore-purple-light hover:text-[var(--text-primary)] text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingMatches.map((match, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                      <span>{match.team1}</span>
                      <span className="text-[var(--text-muted)]">vs</span>
                      <span>{match.team2}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[var(--text-secondary)]">{match.game}</span>
                      <span className="text-xs text-oxymore-purple-light font-medium">{match.prize}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">in {match.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[var(--text-primary)] text-lg font-semibold">Recent Activity</h2>
            <button className="text-oxymore-purple-light hover:text-[var(--text-primary)] text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-oxymore rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{activity.user[0]}</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--text-primary)] font-medium">{activity.user}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-[var(--text-muted)]">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


