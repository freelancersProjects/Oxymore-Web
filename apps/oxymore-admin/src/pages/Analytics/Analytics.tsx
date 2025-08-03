import { useState } from 'react';
import { Users, Trophy, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
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
import Dropdown, { DropdownOption } from '../../components/Dropdown/Dropdown';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Dropdown options
  const timeRangeOptions: DropdownOption[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  // Mock data for charts
  const userActivityData = [
    { name: 'Jan', users: 4000, matches: 200 },
    { name: 'Feb', users: 5000, matches: 250 },
    { name: 'Mar', users: 4800, matches: 220 },
    { name: 'Apr', users: 6000, matches: 300 },
    { name: 'May', users: 5500, matches: 280 },
    { name: 'Jun', users: 7000, matches: 350 },
    { name: 'Jul', users: 8000, matches: 400 }
  ];

  const tournamentData = [
    { name: 'CS2', value: 45 },
    { name: 'Valorant', value: 35 },
    { name: 'LoL', value: 30 },
    { name: 'Dota 2', value: 25 },
    { name: 'R6', value: 20 }
  ];

  const regionData = [
    { name: 'Europe', value: 40 },
    { name: 'North America', value: 35 },
    { name: 'Asia', value: 25 },
    { name: 'South America', value: 15 },
    { name: 'Oceania', value: 10 }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '12,543',
      change: '+12%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Active Tournaments',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Trophy
    },
    {
      title: 'Match Completion Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Average Prize Pool',
      value: '$12,450',
      change: '-3.2%',
      trend: 'down',
      icon: TrendingDown
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="card-base p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">{stat.title}</p>
                <h3 className="text-[var(--text-primary)] text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 bg-oxymore-purple/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-oxymore-purple" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {stat.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* User Activity Chart */}
        <div className="card-base p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">User Activity</h2>
            </div>
            <Dropdown
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              size="sm"
              className="w-32"
            />
          </div>

          <div className="h-[250px] md:h-[300px]">
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
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
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
        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Trophy className="w-5 h-5 text-oxymore-purple" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tournament Distribution</h2>
          </div>

          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tournamentData}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
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
         </div>

        {/* Regional  Distribution */}
        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <MapPin className="w-5 h-5 text-oxymore-purple" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Regional Distribution</h2>
          </div>

          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="users" fill="rgb(147, 51, 234)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <TrendingUp className="w-5 h-5 text-oxymore-purple" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Peak Activity Hours</h2>
          </div>

          <div className="h-[250px] md:h-[300px]">
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
                <XAxis dataKey="hour" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
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

