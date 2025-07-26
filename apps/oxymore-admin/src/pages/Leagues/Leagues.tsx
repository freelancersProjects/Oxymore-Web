import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trophy,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Star,
  Clock,
  ChevronRight
} from 'lucide-react';

const mockLeagues = [
  {
    id: '1',
    name: 'Oxymore Premier League',
    image_url: null,
    max_teams: 12,
    start_date: '2024-03-01',
    end_date: '2024-06-01',
    promotion_slots: 2,
    relegation_slots: 2,
    entry_type: 'invite',
    status: 'active',
    teams_count: 12,
    matches_played: 45,
    current_leader: 'Team Liquid',
    prize_pool: '10,000€'
  },
  {
    id: '2',
    name: 'Oxymore Championship',
    image_url: null,
    max_teams: 10,
    start_date: '2024-03-01',
    end_date: '2024-06-01',
    promotion_slots: 3,
    relegation_slots: 3,
    entry_type: 'open',
    status: 'active',
    teams_count: 8,
    matches_played: 32,
    current_leader: 'NAVI',
    prize_pool: '5,000€'
  },
  {
    id: '3',
    name: 'Oxymore Elite Division',
    image_url: null,
    max_teams: 8,
    start_date: '2024-02-01',
    end_date: '2024-05-01',
    promotion_slots: 2,
    relegation_slots: 2,
    entry_type: 'invite',
    status: 'active',
    teams_count: 8,
    matches_played: 28,
    current_leader: 'Vitality',
    prize_pool: '7,500€'
  }
];

const upcomingLeagues = [
  {
    id: '4',
    name: 'Summer Major League',
    start_date: '2024-06-15',
    max_teams: 16,
    entry_type: 'qualifier',
    prize_pool: '15,000€',
    registration_deadline: '2024-06-01'
  },
  {
    id: '5',
    name: 'Challenger Series',
    start_date: '2024-07-01',
    max_teams: 12,
    entry_type: 'open',
    prize_pool: '3,000€',
    registration_deadline: '2024-06-15'
  }
];

const Leagues = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leagues</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage and monitor competitive leagues</p>
        </div>
        <button
          onClick={() => navigate('/leagues/create')}
          className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create League</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="stat-label">Active Leagues</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">3</h3>
                <span className="text-xs text-green-500">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="stat-label">Total Teams</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">28</h3>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="stat-label">Prize Pool</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">22.5k€</h3>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="stat-label">Upcoming</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">2</h3>
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="card-base p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search leagues..."
              className="input-base w-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'active' ? 'bg-oxymore-purple text-white' : 'button-secondary'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'upcoming' ? 'bg-oxymore-purple text-white' : 'button-secondary'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Active Leagues */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {mockLeagues.map((league) => (
              <div
                key={league.id}
                onClick={() => navigate(`/leagues/${league.id}`)}
                className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] hover:border-oxymore-purple transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{league.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.teams_count}/{league.max_teams} teams
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">{league.prize_pool}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {new Date(league.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                          LIVE
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Current Leader</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">{league.current_leader}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Matches Played</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">{league.matches_played}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Promotion Slots</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {league.promotion_slots} up / {league.relegation_slots} down
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Leagues */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingLeagues.map((league) => (
              <div
                key={league.id}
                onClick={() => navigate(`/leagues/${league.id}`)}
                className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] hover:border-oxymore-purple transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{league.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.max_teams} slots
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">{league.prize_pool}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              Starts {new Date(league.start_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium">
                          UPCOMING
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Entry Type</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1 capitalize">{league.entry_type}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Registration Deadline</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {new Date(league.registration_deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-500 font-medium">Registration Open</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leagues; 
 
 