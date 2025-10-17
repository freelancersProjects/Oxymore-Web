
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Crown,
  Loader2
} from 'lucide-react';
import { useTeams } from '../../hooks/useTeams';

const Teams = () => {
  const navigate = useNavigate();
  const { teams, stats, loading, error, searchTeams } = useTeams();
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchTeams(query);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Teams</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage and monitor teams</p>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="button-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Teams</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage and monitor teams</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Teams</p>
              <h3 className="stat-value">{loading ? '...' : stats.totalTeams}</h3>
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
              <p className="stat-label">Premium Teams</p>
              <h3 className="stat-value">{loading ? '...' : stats.premiumTeams}</h3>
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
              <p className="stat-label">Active Members</p>
              <h3 className="stat-value">{loading ? '...' : formatNumber(stats.activeMembers)}</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-down">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">-2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="card-base p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={handleSearch}
              className="input-base w-full pl-10"
            />
          </div>
          <button className="button-secondary px-4 py-2 rounded-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-oxymore-purple" />
            <span className="ml-3 text-[var(--text-secondary)]">Loading teams...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Team</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Members</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Captain</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Created</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                      No teams found
                    </td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr
                      key={team.id_team}
                      onClick={() => navigate(`/teams/${team.id_team}`)}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--overlay-hover)] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-oxymore flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[var(--text-primary)] font-medium">{team.team_name}</p>
                              {team.subscription_status && (
                                <Star className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm">
                              {team.members_count || 0}/{team.max_members || 10} members
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                          <span className="text-[var(--text-secondary)]">{team.members_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-[var(--text-secondary)]" />
                          <span className="text-[var(--text-secondary)]">{team.captain_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          team.subscription_status ? 'status-active' : 'status-inactive'
                        }`}>
                          {team.subscription_status ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">
                        {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'Unknown'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;

