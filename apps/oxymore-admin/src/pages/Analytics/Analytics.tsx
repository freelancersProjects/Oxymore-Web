import React from 'react';
import {
  TrendingUp,
  Users,
  Trophy,
  Swords,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin
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

const userActivityData = [
  { name: 'Jan', users: 4000, matches: 2400 },
  { name: 'Feb', users: 3000, matches: 1398 },
  { name: 'Mar', users: 2000, matches: 9800 },
  { name: 'Apr', users: 2780, matches: 3908 },
  { name: 'May', users: 1890, matches: 4800 },
  { name: 'Jun', users: 2390, matches: 3800 },
  { name: 'Jul', users: 3490, matches: 4300 },
];

const tournamentData = [
  { name: 'Major', value: 24 },
  { name: 'Minor', value: 48 },
  { name: 'Weekly', value: 156 },
  { name: 'Daily', value: 312 },
];

const regionData = [
  { name: 'EU', users: 8500 },
  { name: 'NA', users: 6200 },
  { name: 'ASIA', users: 4800 },
  { name: 'SA', users: 2100 },
  { name: 'OCE', users: 1500 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-[var(--text-secondary)] mt-1">Platform performance and statistics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">23.1k</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Active Teams</p>
              <h3 className="stat-value">1.2k</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Matches</p>
              <h3 className="stat-value">156k</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+8%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Premium Users</p>
              <h3 className="stat-value">4.8k</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-down">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">-2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">User Activity</h2>
            </div>
            <select className="input-base px-3 py-1">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(147, 51, 234)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="rgb(147, 51, 234)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="rgb(147, 51, 234)"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="matches"
                  stroke="rgb(59, 130, 246)"
                  fillOpacity={1}
                  fill="url(#colorMatches)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tournament Distribution */}
        <div className="card-base p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-oxymore-purple" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tournament Distribution</h2>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tournamentData}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" fill="rgb(147, 51, 234)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="card-base p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-oxymore-purple" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Regional Distribution</h2>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="users" fill="rgb(147, 51, 234)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="card-base p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-oxymore-purple" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Peak Activity Hours</h2>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { hour: '00:00', users: 1200 },
                  { hour: '04:00', users: 800 },
                  { hour: '08:00', users: 2400 },
                  { hour: '12:00', users: 3800 },
                  { hour: '16:00', users: 4200 },
                  { hour: '20:00', users: 3600 },
                  { hour: '23:59', users: 2200 }
                ]}
              >
                <defs>
                  <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(147, 51, 234)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="rgb(147, 51, 234)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="rgb(147, 51, 234)"
                  fillOpacity={1}
                  fill="url(#colorPeak)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
 
 