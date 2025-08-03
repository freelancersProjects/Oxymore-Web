import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  X
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
import Dropdown, { DropdownOption } from '../../components/Dropdown/Dropdown';
import { AnimatePresence } from 'framer-motion';

const Dashboard = (): React.JSX.Element => {
  const { stats, loading } = useStats();
  const [timeRange, setTimeRange] = useState('7d');
  const [distributionType, setDistributionType] = useState('game');
  const [showUpcomingMatchesModal, setShowUpcomingMatchesModal] = useState(false);
  const [showRecentActivityModal, setShowRecentActivityModal] = useState(false);
  const [matchesFilter, setMatchesFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');

  // Dropdown options
  const timeRangeOptions: DropdownOption[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const distributionOptions: DropdownOption[] = [
    { value: 'game', label: 'By Game' },
    { value: 'region', label: 'By Region' }
  ];

  const matchesFilterOptions: DropdownOption[] = [
    { value: 'all', label: 'All Matches' },
    { value: 'cs2', label: 'CS2' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'lol', label: 'League of Legends' },
    { value: 'dota2', label: 'Dota 2' },
    { value: 'r6', label: 'Rainbow Six' }
  ];

  const activityFilterOptions: DropdownOption[] = [
    { value: 'all', label: 'All Activities' },
    { value: 'tournament', label: 'Tournaments' },
    { value: 'match', label: 'Matches' },
    { value: 'user', label: 'User Actions' },
    { value: 'team', label: 'Team Actions' }
  ];

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
    { team1: 'Team Liquid', team2: 'NAVI', time: '2h', game: 'CS2', prize: '$50,000', tournament: 'ESL Pro League', status: 'upcoming', team1Logo: 'TL', team2Logo: 'NAVI', viewers: '45.2K' },
    { team1: 'Fnatic', team2: 'G2', time: '4h', game: 'Valorant', prize: '$30,000', tournament: 'VCT Masters', status: 'upcoming', team1Logo: 'FNC', team2Logo: 'G2', viewers: '32.1K' },
    { team1: 'T1', team2: 'DRX', time: '6h', game: 'LoL', prize: '$40,000', tournament: 'LCK Spring', status: 'upcoming', team1Logo: 'T1', team2Logo: 'DRX', viewers: '28.7K' },
    { team1: 'Cloud9', team2: '100 Thieves', time: '8h', game: 'CS2', prize: '$25,000', tournament: 'BLAST Premier', status: 'upcoming', team1Logo: 'C9', team2Logo: '100T', viewers: '18.9K' },
    { team1: 'FaZe Clan', team2: 'Astralis', time: '10h', game: 'CS2', prize: '$35,000', tournament: 'IEM Katowice', status: 'upcoming', team1Logo: 'FaZe', team2Logo: 'AST', viewers: '22.3K' },
    { team1: 'Sentinels', team2: 'Optic Gaming', time: '12h', game: 'Valorant', prize: '$20,000', tournament: 'VCT Challengers', status: 'upcoming', team1Logo: 'SEN', team2Logo: 'OPT', viewers: '15.6K' }
  ];

  const recentActivity = [
    { user: 'ProGamer_2023', action: 'Joined tournament "CS2 Major"', time: '2 min ago', type: 'tournament', game: 'CS2', details: 'Registered for CS2 Major tournament with prize pool of $500,000', avatar: 'PG', status: 'success' },
    { user: 'Team_Alpha', action: 'Registered for league', time: '5 min ago', type: 'team', game: 'Valorant', details: 'Team Alpha officially registered for VCT Challengers League', avatar: 'TA', status: 'info' },
    { user: 'ElitePlayer', action: 'Won match vs Team_Beta', time: '12 min ago', type: 'match', game: 'LoL', details: 'Victory in League of Legends match with score 2-1', avatar: 'EP', status: 'success' },
    { user: 'NextGenESports', action: 'Created new tournament', time: '1h ago', type: 'tournament', game: 'CS2', details: 'Launched "NextGen Championship" with $100,000 prize pool', avatar: 'NG', status: 'success' },
    { user: 'GamingPro', action: 'Updated profile settings', time: '1h 15m ago', type: 'user', game: 'General', details: 'Updated profile picture and bio information', avatar: 'GP', status: 'info' },
    { user: 'Team_Omega', action: 'Disqualified from tournament', time: '2h ago', type: 'tournament', game: 'Dota 2', details: 'Disqualified due to rule violation in Dota 2 tournament', avatar: 'TO', status: 'error' },
    { user: 'StreamMaster', action: 'Started live stream', time: '2h 30m ago', type: 'user', game: 'CS2', details: 'Started streaming CS2 gameplay with 1.2K viewers', avatar: 'SM', status: 'success' },
    { user: 'EsportsOrg', action: 'Announced new roster', time: '3h ago', type: 'team', game: 'Valorant', details: 'Announced new Valorant roster with 5 players', avatar: 'EO', status: 'info' }
  ];

  return (
    <div className="space-y-4 md:space-y-6 pb-4 md:pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs md:text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />}
              </span>
            </div>
            <div className="mt-3 md:mt-4">
              <h3 className="text-[var(--text-secondary)] text-xs md:text-sm">{stat.title}</h3>
              <p className="text-[var(--text-primary)] text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* User Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
            <h2 className="text-[var(--text-primary)] text-base md:text-lg font-semibold">User Activity</h2>
            <Dropdown
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              size="sm"
              className="w-32"
            />
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="rgb(147, 51, 234)"
                  fill="rgb(147, 51, 234)"
                   fillOpacity={0.1}
                 />
              </AreaChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tourname nt Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
            <h2 className="text-[var(--text-primary)] text-base md:text-lg font-semibold">Tournament Distribution</h2>
            <Dropdown
              options={distributionOptions}
              value={distributionType}
              onChange={setDistributionType}
              size="sm"
              className="w-32"
            />
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tournamentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" fill="rgb(147, 51, 234)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upcoming Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[var(--text-primary)] text-base md:text-lg font-semibold">Upcoming Matches</h2>
            <button
              onClick={() => setShowUpcomingMatchesModal(true)}
              className="text-oxymore-purple-light hover:text-[var(--text-primary)] text-xs md:text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {upcomingMatches.map((match, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 md:gap-2 text-[var(--text-primary)] font-medium text-sm md:text-base">
                      <span className="truncate">{match.team1}</span>
                      <span className="text-[var(--text-muted)] flex-shrink-0">vs</span>
                      <span className="truncate">{match.team2}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs md:text-sm text-[var(--text-secondary)]">{match.game}</span>
                      <span className="text-xs text-oxymore-purple-light font-medium">{match.prize}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-[var(--text-secondary)] flex-shrink-0">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">in {match.time}</span>
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
          className="bg-[var(--card-background)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[var(--text-primary)] text-base md:text-lg font-semibold">Recent Activity</h2>
            <button
              onClick={() => setShowRecentActivityModal(true)}
              className="text-oxymore-purple-light hover:text-[var(--text-primary)] text-xs md:text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-oxymore rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm md:text-base">{activity.user[0]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[var(--text-primary)] font-medium text-sm md:text-base truncate">{activity.user}</h4>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] truncate">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-[var(--text-muted)] flex-shrink-0">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Matches Modal */}
      <AnimatePresence>
        {showUpcomingMatchesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowUpcomingMatchesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-background)] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-oxymore rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Upcoming Matches</h2>
                    <p className="text-sm text-[var(--text-secondary)]">All scheduled matches and tournaments</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Dropdown
                    options={matchesFilterOptions}
                    value={matchesFilter}
                    onChange={setMatchesFilter}
                    size="sm"
                    className="w-32 sm:w-40"
                  />
                  <button
                    onClick={() => setShowUpcomingMatchesModal(false)}
                    className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
                <div className="grid gap-3 sm:gap-4">
                  {upcomingMatches.map((match, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--overlay-hover)] rounded-xl p-4 sm:p-6 hover:bg-[var(--overlay-active)] transition-all border border-[var(--border-color)]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">{match.tournament}</h3>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{match.game} • {match.prize}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 sm:px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full">
                            {match.status}
                          </span>
                          <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                            {match.viewers}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center justify-center lg:justify-start">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-blue rounded-xl flex items-center justify-center mb-2">
                                <span className="text-white font-bold text-xs sm:text-sm">{match.team1Logo}</span>
                              </div>
                              <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">{match.team1}</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-2xl font-bold text-[var(--text-muted)] mb-2">VS</div>
                              <p className="text-xs text-[var(--text-secondary)]">Best of 3</p>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-red rounded-xl flex items-center justify-center mb-2">
                                <span className="text-white font-bold text-xs sm:text-sm">{match.team2Logo}</span>
                              </div>
                              <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">{match.team2}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1">in {match.time}</div>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Starting soon</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Activity Modal */}
      <AnimatePresence>
        {showRecentActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowRecentActivityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-background)] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-oxymore rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Recent Activity</h2>
                    <p className="text-sm text-[var(--text-secondary)]">All recent activities and events</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Dropdown
                    options={activityFilterOptions}
                    value={activityFilter}
                    onChange={setActivityFilter}
                    size="sm"
                    className="w-32 sm:w-40"
                  />
                  <button
                    onClick={() => setShowRecentActivityModal(false)}
                    className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--overlay-hover)] rounded-xl p-4 sm:p-6 hover:bg-[var(--overlay-active)] transition-all border border-[var(--border-color)]"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                            activity.status === 'success' ? 'bg-green-500/10' :
                            activity.status === 'error' ? 'bg-red-500/10' :
                            'bg-blue-500/10'
                          }`}>
                            <span className={`font-bold text-sm ${
                              activity.status === 'success' ? 'text-green-400' :
                              activity.status === 'error' ? 'text-red-400' :
                              'text-blue-400'
                            }`}>{activity.avatar}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">{activity.user}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                activity.status === 'success' ? 'bg-green-500/10 text-green-400' :
                                activity.status === 'error' ? 'bg-red-500/10 text-red-400' :
                                'bg-blue-500/10 text-blue-400'
                              }`}>
                                {activity.type}
                              </span>
                              <span className="px-2 py-1 bg-[var(--overlay-active)] text-xs font-medium rounded-full text-[var(--text-secondary)]">
                                {activity.game}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-[var(--text-muted)] flex-shrink-0">{activity.time}</span>
                          </div>
                          <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] mb-2">{activity.action}</p>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{activity.details}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;


