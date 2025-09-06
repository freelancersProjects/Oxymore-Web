import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { apiService } from '../../api/apiService';
import type { LeagueExtended } from "@/types";

const LeagueDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [league, setLeague] = useState<LeagueExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeague = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await apiService.get<LeagueExtended>(`/leagues/${id}`);
        setLeague(response);
      } catch (err) {
        console.error('Error fetching league:', err);
        setError('Failed to load league details');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-secondary)]">Loading league details...</div>
      </div>
    );
  }

  if (error || !league) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error || 'League not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/leagues")}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            {league.league_name}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">
            League management and overview
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="stat-label">Teams</p>
              <div className="flex items-center gap-2">
                <h3 className="stat-value">
                  {league.teams?.length || 0}/{league.max_teams || 0}
                </h3>
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
              <h3 className="stat-value">{league.promotion_slots || 0}</h3>
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
              <h3 className="stat-value">{league.relegation_slots || 0}</h3>
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
              <p className="text-[var(--text-primary)] text-xs md:text-sm">
                {league.start_date
                  ? new Date(league.start_date).toLocaleDateString()
                  : "TBD"}{" "}
                -{" "}
                {league.end_date
                  ? new Date(league.end_date).toLocaleDateString()
                  : "TBD"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* League Table */}
          <div className="card-base p-4 md:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 md:mb-6">
              League Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      Pos
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      Team
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      P
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      W
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      D
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      L
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      GF
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      GA
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      GD
                    </th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-[var(--text-secondary)]">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(league.teams || []).map((team, index) => (
                    <tr
                      key={team.id}
                      className={`border-b border-[var(--border-color)] ${
                        index < (league.promotion_slots || 0)
                          ? "bg-green-500/5"
                          : index >=
                            (league.teams?.length || 0) -
                              (league.relegation_slots || 0)
                          ? "bg-red-500/5"
                          : ""
                      }`}
                    >
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {index + 1}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                            <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                          <span className="text-[var(--text-primary)] text-xs md:text-sm truncate">
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.matches_played}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.wins}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.draws}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.losses}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.goals_for}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.goals_against}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-[var(--text-primary)] text-xs md:text-sm">
                        {team.goals_for - team.goals_against}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 font-semibold text-[var(--text-primary)] text-xs md:text-sm">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Upcoming Matches */}
            <div className="card-base p-4 md:p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 md:mb-6">
                Upcoming Matches
              </h2>
              <div className="space-y-3 md:space-y-4">
                {(league.upcoming_matches || []).map((match) => (
                  <div
                    key={match.id}
                    className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <span className="text-[var(--text-secondary)] text-xs md:text-sm">
                        {match.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--text-secondary)] text-xs md:text-sm">
                          {new Date(match.date).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-primary)] text-sm md:text-base truncate">
                        {match.team1}
                      </span>
                      <span className="text-[var(--text-muted)] text-xs md:text-sm flex-shrink-0 mx-2">
                        vs
                      </span>
                      <span className="text-[var(--text-primary)] text-sm md:text-base truncate">
                        {match.team2}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="card-base p-4 md:p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 md:mb-6">
                Recent Results
              </h2>
              <div className="space-y-3 md:space-y-4">
                {(league.recent_matches || []).map((match) => (
                  <div
                    key={match.id}
                    className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl hover:bg-[var(--overlay-active)] transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <span className="text-[var(--text-secondary)] text-xs md:text-sm">
                        {match.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--text-secondary)] text-xs md:text-sm">
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-primary)] text-sm md:text-base truncate">
                        {match.team1}
                      </span>
                      <span className="font-semibold text-[var(--text-primary)] text-sm md:text-base flex-shrink-0 mx-2">
                        {match.team1_score} - {match.team2_score}
                      </span>
                      <span className="text-[var(--text-primary)] text-sm md:text-base truncate">
                        {match.team2}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Champion Badge */}
          <div className="card-base p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Star className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Champion Badge
              </h2>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-medium text-sm md:text-base">
                  {league.badge_champion?.name || "No badge assigned"}
                </h3>
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">
                  Awarded to league winner
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-base p-4 md:p-6">
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/leagues/edit/${id}`)}
                className="w-full py-2 px-4 bg-oxymore-purple text-white rounded-xl hover:bg-oxymore-purple-light transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Settings className="w-4 h-4" />
                <span>Edit League</span>
              </button>
              <button className="w-full py-2 px-4 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
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

