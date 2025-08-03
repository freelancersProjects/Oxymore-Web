import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Trophy,
  Monitor,
  Calendar,
  MapPin,
  ChevronRight,
  Clock,
  Swords,
  Shield
} from 'lucide-react';

const mockMatches = [
  {
    id: '1',
    tournament: {
      id: '1',
      name: 'Oxymore Major 2024',
      type: 'tournament',
      stage: 'Quarter Finals'
    },
    team1: {
      id: '1',
      name: 'Team Liquid',
      logo: null,
      score: 1
    },
    team2: {
      id: '2',
      name: 'Fnatic',
      logo: null,
      score: 0
    },
    status: 'live',
    is_streamed: true,
    match_date: '2024-02-20T15:00:00',
    maps: [
      { name: 'Inferno', status: 'completed', winner: 'Team Liquid', score: '16-14' },
      { name: 'Mirage', status: 'live', score: '12-10' },
      { name: 'Ancient', status: 'upcoming' }
    ],
    room: {
      id: '1',
      name: 'Room #1',
      status: 'active'
    }
  },
  {
    id: '2',
    tournament: {
      id: '1',
      name: 'Oxymore Major 2024',
      type: 'tournament',
      stage: 'Quarter Finals'
    },
    team1: {
      id: '3',
      name: 'NAVI',
      logo: null,
      score: 0
    },
    team2: {
      id: '4',
      name: 'Vitality',
      logo: null,
      score: 0
    },
    status: 'upcoming',
    is_streamed: true,
    match_date: '2024-02-20T18:00:00',
    maps: [
      { name: 'Vertigo', status: 'upcoming' },
      { name: 'Nuke', status: 'upcoming' },
      { name: 'Overpass', status: 'upcoming' }
    ],
    room: {
      id: '2',
      name: 'Room #2',
      status: 'waiting'
    }
  }
];

const Matches = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'live', 'upcoming'

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Matches</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">View and manage ongoing and upcoming matches</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Swords className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="stat-label">Live Matches</p>
              <h3 className="stat-value">3</h3>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="stat-label">Upcoming Matches</p>
              <h3 className="stat-value">12</h3>
            </div>
          </div>
        </div>

        <div className="stat-card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="stat-label">Active Streams</p>
              <h3 className="stat-value">2</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card-base p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search matches..."
              className="input-base w-full pl-10 text-sm md:text-base"
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
                filter === 'all' ? 'bg-oxymore-purple text-white' : 'button-secondary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
                filter === 'live' ? 'bg-oxymore-purple text-white' : 'button-secondary'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
                filter === 'upcoming' ? 'bg-oxymore-purple text-white' : 'button-secondary'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-3 md:space-y-4">
          {mockMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => navigate(`/matches/${match.id}`)}
              className="p-3 md:p-4 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] hover:border-oxymore-purple transition-colors cursor-pointer"
            >
              {/* Tournament Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 md:mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-oxymore-purple" />
                  <span className="text-[var(--text-secondary)] text-xs md:text-sm">{match.tournament.name}</span>
                </div>
                <span className="text-[var(--text-muted)] hidden sm:inline text-sm">•</span>
                <span className="text-[var(--text-secondary)] text-xs md:text-sm">{match.tournament.stage}</span>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 md:gap-4 items-center mb-4 md:mb-6">
                {/* Team 1 */}
                <div className="sm:col-span-3">
                  <div className="flex items-center gap-2 md:gap-3 justify-center sm:justify-end">
                    <div className="text-center sm:text-right">
                      <p className="font-medium text-[var(--text-primary)] text-sm md:text-base">{match.team1.name}</p>
                      <p className="text-xs md:text-sm text-[var(--text-secondary)]">Rank #1</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-oxymore flex items-center justify-center">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{match.team1.score}</span>
                    <span className="text-[var(--text-muted)]">:</span>
                    <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{match.team2.score}</span>
                  </div>
                </div>

                {/* Team 2 */}
                <div className="sm:col-span-3">
                  <div className="flex items-center gap-2 md:gap-3 justify-center sm:justify-start">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-oxymore flex items-center justify-center">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-medium text-[var(--text-primary)] text-sm md:text-base">{match.team2.name}</p>
                      <p className="text-xs md:text-sm text-[var(--text-secondary)]">Rank #2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      match.status === 'live' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-xs md:text-sm font-medium text-[var(--text-secondary)]">
                      {match.status === 'live' ? 'LIVE' : 'UPCOMING'}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-[var(--text-secondary)]" />
                    <span className="text-xs md:text-sm text-[var(--text-secondary)]">
                      {new Date(match.match_date).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Maps */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[var(--text-secondary)]" />
                    <div className="flex items-center gap-1 flex-wrap">
                      {match.maps.map((map, index) => (
                        <span
                          key={index}
                          className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs font-medium ${
                            map.status === 'live'
                              ? 'bg-green-500/10 text-green-500'
                              : map.status === 'completed'
                              ? 'bg-[var(--overlay-hover)] text-[var(--text-secondary)]'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {map.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stream */}
                  {match.is_streamed && (
                    <div className="flex items-center gap-2">
                      <Monitor className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                      <span className="text-xs md:text-sm text-purple-500">Streamed</span>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[var(--text-secondary)] self-end sm:self-center" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
