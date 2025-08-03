
import {
  Users,
  Trophy,
  Shield,
  MessageSquare,
  Star,
  Clock,
  Search,
  ArrowUpRight
} from 'lucide-react';

const mockActivities = [
  {
    id: '1',
    type: 'tournament',
    title: 'Oxymore Major 2024 Started',
    description: 'The tournament has begun with 16 teams competing',
    time: '2 hours ago',
    icon: Trophy,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: '2',
    type: 'team',
    title: 'Team Liquid vs Fnatic',
    description: 'Quarter Finals match is now live',
    time: '3 hours ago',
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: '3',
    type: 'user',
    title: 'New Premium User',
    description: 'John Doe upgraded to premium subscription',
    time: '5 hours ago',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: '4',
    type: 'chat',
    title: 'Match Chat Activity',
    description: 'High activity in Team Liquid vs Fnatic match chat',
    time: '6 hours ago',
    icon: MessageSquare,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    id: '5',
    type: 'user',
    title: 'User Milestone',
    description: 'Platform reached 20,000 registered users',
    time: '1 day ago',
    icon: Users,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  }
];

const activityFilters = [
  { label: 'All', value: 'all' },
  { label: 'Tournaments', value: 'tournament' },
  { label: 'Teams', value: 'team' },
  { label: 'Users', value: 'user' },
  { label: 'Chat', value: 'chat' }
];

const Activity = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Activity</h1>
        <p className="text-[var(--text-secondary)] mt-1">Real-time platform activity and events</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="stat-label">Active Tournaments</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">24</h3>
                <span className="text-xs text-green-500">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="stat-label">Ongoing Matches</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">156</h3>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="stat-label">Online Users</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">1.2k</h3>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card-base p-4 md:p-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-4 md:mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search activity..."
              className="input-base w-full pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {activityFilters.map((filter) => (
              <button
                key={filter.value}
                className="px-3 md:px-4 py-2 rounded-xl button-secondary text-sm md:text-base"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3 md:space-y-4">
          {mockActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-4 h-4 md:w-5 md:h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--text-primary)] text-sm md:text-base">{activity.title}</h3>
                      <p className="text-[var(--text-secondary)] mt-1 text-sm">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs md:text-sm">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-4 md:mt-6 text-center">
          <button className="button-secondary px-4 md:px-6 py-2 text-sm md:text-base">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Activity;

