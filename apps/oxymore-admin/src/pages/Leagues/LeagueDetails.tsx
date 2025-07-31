import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  Star,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Settings,
  Ban
} from 'lucide-react';

const mockLeague = {
  id: '1',
  name: 'Oxymore Premier League',
  image_url: null,
  max_teams: 12,
  start_date: '2024-03-01',
  end_date: '2024-06-01',
  promotion_slots: 2,
  relegation_slots: 2,
  entry_type: 'invite',
  badge_champion: {
    id: '1',
    name: 'League Champion',
    image_url: null
  },
  teams: [
    {
      id: '1',
      name: 'Team Liquid',
      points: 28,
      matches_played: 12,
      wins: 9,
      draws: 1,
      losses: 2,
      goals_for: 45,
      goals_against: 23
    },
    {
      id: '2',
      name: 'Fnatic',
      points: 25,
      matches_played: 12,
      wins: 8,
      draws: 1,
      losses: 3,
      goals_for: 38,
      goals_against: 25
    },
    {
      id: '3',
      name: 'NAVI',
      points: 22,
      matches_played: 12,
      wins: 7,
      draws: 1,
      losses: 4,
      goals_for: 35,
      goals_against: 28
    }
  ],
  upcoming_matches: [
    {
      id: '1',
      team1: 'Team Liquid',
      team2: 'Fnatic',
      date: '2024-03-15T18:00:00',
      type: 'Regular Season'
    },
    {
      id: '2',
      team1: 'NAVI',
      team2: 'Vitality',
      date: '2024-03-16T18:00:00',
      type: 'Regular Season'
    }
  ],
  recent_matches: [
    {
      id: '3',
      team1: 'Team Liquid',
      team1_score: 16,
      team2: 'NAVI',
      team2_score: 14,
      date: '2024-03-10T18:00:00',
      type: 'Regular Season'
    },
    {
      id: '4',
      team1: 'Fnatic',
      team1_score: 16,
      team2: 'Vitality',
      team2_score: 12,
      date: '2024-03-09T18:00:00',
      type: 'Regular Season'
    }
  ]
};

const LeagueDetails = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leagues')}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{mockLeague.name}</h1>
          <p className="text-[var(--text-secondary)] mt-1">League management and overview</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="stat-label">Teams</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">{mockLeague.teams.length}/{mockLeague.max_teams}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="stat-label">Promotion Slots</p>
              <h3 className="stat-value">{mockLeague.promotion_slots}</h3>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="stat-label">Relegation Slots</p>
              <h3 className="stat-value">{mockLeague.relegation_slots}</h3>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="stat-label">Duration</p>
              <p className="text-[var(--text-primary)] text-sm">
                {new Date(mockLeague.start_date).toLocaleDateString()} - {new Date(mockLeague.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* League Table */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">League Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Position</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Team</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">P</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">W</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">D</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">L</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">GF</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">GA</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">GD</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeague.teams.map((team, index) => (
                    <tr
                      key={team.id}
                      className={`border-b border-[var(--border-color)] ${
                        index < mockLeague.promotion_slots
                          ? 'bg-green-500/5'
                          : index >= mockLeague.teams.length - mockLeague.relegation_slots
                          ? 'bg-red-500/5'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-4 text-[var(--text-primary)]">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[var(--text-primary)]">{team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.matches_played}</td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.wins}</td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.draws}</td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.losses}</td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.goals_for}</td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.goals_against}</td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{team.goals_for - team.goals_against}</td>
                      <td className="px-4 py-4 font-semibold text-[var(--text-primary)]">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Matches */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Upcoming Matches</h2>
              <div className="space-y-4">
                {mockLeague.upcoming_matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-secondary)] text-sm">{match.type}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--text-secondary)] text-sm">
                          {new Date(match.date).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-primary)]">{match.team1}</span>
                      <span className="text-[var(--text-muted)]">vs</span>
                      <span className="text-[var(--text-primary)]">{match.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Recent Results</h2>
              <div className="space-y-4">
                {mockLeague.recent_matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-secondary)] text-sm">{match.type}</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--text-secondary)] text-sm">
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-primary)]">{match.team1}</span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {match.team1_score} - {match.team2_score}
                      </span>
                      <span className="text-[var(--text-primary)]">{match.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Champion Badge */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Champion Badge</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium">{mockLeague.badge_champion.name}</h3>
                <p className="text-[var(--text-secondary)] text-sm">Awarded to league winner</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-base p-6">
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-oxymore-purple text-white rounded-xl hover:bg-oxymore-purple-light transition-colors flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Edit League</span>
              </button>
              <button className="w-full py-2 px-4 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" />
                <span>Cancel League</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetails;

