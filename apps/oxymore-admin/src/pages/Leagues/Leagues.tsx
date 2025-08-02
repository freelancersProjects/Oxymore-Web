import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trophy,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Star,
  Clock,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { League } from '../../types/league';

const Leagues = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const data = await apiService.get<League[]>('/leagues');
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  // Calculer les stats basées sur les vraies données
  const activeLeagues = leagues.filter(league => {
    const now = new Date();
    const startDate = league.start_date ? new Date(league.start_date) : null;
    const endDate = league.end_date ? new Date(league.end_date) : null;

    if (!startDate) return false;
    if (endDate && now > endDate) return false;

    return now >= startDate;
  });

  const upcomingLeagues = leagues.filter(league => {
    const now = new Date();
    const startDate = league.start_date ? new Date(league.start_date) : null;

    return startDate && now < startDate;
  });

  const allLeagues = leagues;

  const totalTeams = leagues.reduce((sum, league) => sum + (league.max_teams || 0), 0);
  const totalPrizePool = leagues.length * 5000; // Estimation pour l'exemple

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
                <h3 className="stat-value">{activeLeagues.length}</h3>
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
                <h3 className="stat-value">{totalTeams}</h3>
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
                <h3 className="stat-value">{(totalPrizePool / 1000).toFixed(1)}k€</h3>
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
                <h3 className="stat-value">{upcomingLeagues.length}</h3>
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
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'all' ? 'bg-oxymore-purple text-white' : 'button-secondary'
              }`}
            >
              All
            </button>
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

        {/* All Leagues */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {allLeagues.map((league) => {
              const now = new Date();
              const startDate = league.start_date ? new Date(league.start_date) : null;
              const endDate = league.end_date ? new Date(league.end_date) : null;

              let statusText = 'UPCOMING';
              let statusColor = 'bg-blue-500/10 text-blue-500';

              if (startDate && now >= startDate) {
                if (endDate && now > endDate) {
                  statusText = 'ENDED';
                  statusColor = 'bg-gray-500/10 text-gray-500';
                } else {
                  statusText = 'LIVE';
                  statusColor = 'bg-green-500/10 text-green-500';
                }
              }

              return (
              <div
                key={league.id_league}
                onClick={() => navigate(`/leagues/${league.id_league}`)}
                className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] hover:border-oxymore-purple transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{league.league_name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.max_teams || 0} teams max
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">Prize Pool</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.end_date ? new Date(league.end_date).toLocaleDateString() : 'No end date'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 ${statusColor} rounded-full text-sm font-medium`}>
                          {statusText}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Entry Type</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1 capitalize">{league.entry_type || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Start Date</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {league.start_date ? new Date(league.start_date).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Promotion/Relegation</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {league.promotion_slots || 0} up / {league.relegation_slots || 0} down
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}

        {/* Active Leagues */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeLeagues.map((league) => (
              <div
                key={league.id_league}
                onClick={() => navigate(`/leagues/${league.id_league}`)}
                className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] hover:border-oxymore-purple transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{league.league_name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.max_teams || 0} teams max
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">Prize Pool</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.end_date ? new Date(league.end_date).toLocaleDateString() : 'No end date'}
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
                        <p className="text-[var(--text-secondary)] text-sm">Entry Type</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1 capitalize">{league.entry_type || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Start Date</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {league.start_date ? new Date(league.start_date).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Promotion/Relegation</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {league.promotion_slots || 0} up / {league.relegation_slots || 0} down
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
                key={league.id_league}
                onClick={() => navigate(`/leagues/${league.id_league}`)}
                className="p-6 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] hover:border-oxymore-purple transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{league.league_name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              {league.max_teams || 0} slots
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">Prize Pool</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              Starts {league.start_date ? new Date(league.start_date).toLocaleDateString() : 'TBD'}
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
                        <p className="text-[var(--text-primary)] font-medium mt-1 capitalize">{league.entry_type || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--overlay-hover)]">
                        <p className="text-[var(--text-secondary)] text-sm">Start Date</p>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {league.start_date ? new Date(league.start_date).toLocaleDateString() : 'Not set'}
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

