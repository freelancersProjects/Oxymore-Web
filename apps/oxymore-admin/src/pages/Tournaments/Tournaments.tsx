import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Search,
  Filter,
  Edit,
  Trash,
  ArrowUpRight,
  ArrowDownRight,
  History as HistoryIcon,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CustomCheckbox } from '../../components/CustomCheckbox/CustomCheckbox';
import { apiService } from '../../api/apiService';
import { Tournament, TournamentFilterState } from '../../types';
import { format } from 'date-fns';
import Loader from '../../components/Loader/Loader';
import Tooltip from '../../components/Tooltip/Tooltip';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TournamentFilterState>({
    type: null,
    structure: null,
    isPremium: null,
    hasCashPrize: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    filterTournaments();
  }, [tournaments, searchQuery, filters]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Tournament[]>('/tournaments');
      setTournaments(data);
      setFilteredTournaments(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des tournois');
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTournaments = () => {
    let result = [...tournaments];

    // Recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tournament =>
        tournament.tournament_name.toLowerCase().includes(query) ||
        tournament.description?.toLowerCase().includes(query) ||
        tournament.type.toLowerCase().includes(query) ||
        tournament.structure.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (filters.type !== null && filters.type !== 'any') {
      result = result.filter(tournament => tournament.type === filters.type);
    }
    if (filters.structure !== null && filters.structure !== 'any') {
      result = result.filter(tournament => tournament.structure === filters.structure);
    }
    if (filters.isPremium !== null) {
      result = result.filter(tournament => tournament.is_premium === filters.isPremium);
    }
    if (filters.hasCashPrize !== null) {
      result = result.filter(tournament =>
        filters.hasCashPrize ? (tournament.cash_prize && tournament.cash_prize > 0) : (!tournament.cash_prize || tournament.cash_prize === 0)
      );
    }

    setFilteredTournaments(result);
  };

  const handleDelete = async (tournamentId: string) => {
    try {
      await apiService.delete(`/tournaments/${tournamentId}`);
      setTournaments(tournaments.filter(tournament => tournament.id_tournament !== tournamentId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting tournament:', err);
    }
  };

  const handleEdit = (tournamentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/tournaments/edit/${tournamentId}`);
  };

  const handleDeleteClick = (tournamentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirm(tournamentId);
  };

  const calculateStatus = (startDate: string, endDate: string): 'upcoming' | 'active' | 'completed' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  const stats = [
    {
      title: 'Total Tournaments',
      value: tournaments.length.toString(),
      change: '+8%',
      trend: 'up',
      color: 'bg-gradient-blue'
    },
    {
      title: 'Active Today',
      value: tournaments.filter(t => calculateStatus(t.start_date, t.end_date) === 'active').length.toString(),
      change: '+12%',
      trend: 'up',
      color: 'bg-gradient-purple'
    },
    {
      title: 'Prize Pool',
      value: `€${tournaments.reduce((sum, t) => sum + (t.cash_prize || 0), 0).toLocaleString()}`,
      change: '+5%',
      trend: 'up',
      color: 'bg-gradient-oxymore'
    }
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedTournaments(checked ? filteredTournaments.map(t => t.id_tournament) : []);
  };

  const toggleTournamentSelection = (tournamentId: string) => {
    setSelectedTournaments(prev => {
      const newSelection = prev.includes(tournamentId)
        ? prev.filter(id => id !== tournamentId)
        : [...prev, tournamentId];

      setSelectAll(newSelection.length === filteredTournaments.length);
      return newSelection;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400/10 text-green-400';
      case 'upcoming':
        return 'bg-blue-400/10 text-blue-400';
      case 'completed':
        return 'bg-gray-400/10 text-gray-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
  };

  const toggleFilter = (key: keyof TournamentFilterState) => {
    setFilters((prev: TournamentFilterState) => {
      const currentValue = prev[key];
      if (key === 'type' || key === 'structure') {
        // Pour les chaînes, on alterne entre null et la valeur actuelle
        return {
          ...prev,
          [key]: currentValue === null ? 'any' : null
        };
      } else {
        // Pour les booléens, on alterne entre null, true, false
        return {
          ...prev,
          [key]: currentValue === null ? true : currentValue === true ? false : null
        };
      }
    });
  };

  const getFilterButtonClass = (value: boolean | null) => {
    if (value === null) return 'text-secondary bg-[var(--overlay-hover)]';
    if (value === true) return 'text-green-400 bg-green-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const clearFilters = () => {
    setFilters({
      type: null,
      structure: null,
      isPremium: null,
      hasCashPrize: null
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-1">Manage and monitor tournaments</p>
        </div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-1">Manage and monitor tournaments</p>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchTournaments}
            className="button-primary px-4 py-2 rounded-xl"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-1">Manage and monitor tournaments</p>
        </div>
        <button
          onClick={() => navigate('/tournaments/create')}
          className="button-primary px-4 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto"
        >
          <Trophy className="w-5 h-5" />
          Create Tournament
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
              <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'stat-trend-up' : 'stat-trend-down'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card-base p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments..."
              className="input-base w-full pl-10"
            />
          </div>
          <div className="relative">
            <button
              className={`button-secondary px-4 py-2 rounded-xl flex items-center gap-2 ${
                showFilters ? "bg-oxymore-purple text-white" : ""
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              {(filters.type !== null ||
                filters.structure !== null ||
                filters.isPremium !== null ||
                filters.hasCashPrize !== null) && (
                <span className="w-2 h-2 rounded-full bg-oxymore-purple absolute -top-1 -right-1" />
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-[var(--border-color)] pt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-secondary hover:text-primary transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => toggleFilter('type')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filters.type === null ? 'text-secondary bg-[var(--overlay-hover)]' : 'text-green-400 bg-green-400/10'}`}
              >
                {filters.type === null ? 'All Types' : 'Type Filtered'}
              </button>
              <button
                onClick={() => toggleFilter('structure')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filters.structure === null ? 'text-secondary bg-[var(--overlay-hover)]' : 'text-green-400 bg-green-400/10'}`}
              >
                {filters.structure === null ? 'All Structures' : 'Structure Filtered'}
              </button>
              <button
                onClick={() => toggleFilter('isPremium')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${getFilterButtonClass(filters.isPremium)}`}
              >
                {filters.isPremium === null ? 'All Tournaments' : filters.isPremium === true ? 'Premium Only' : 'Non-Premium Only'}
              </button>
              <button
                onClick={() => toggleFilter('hasCashPrize')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${getFilterButtonClass(filters.hasCashPrize)}`}
              >
                {filters.hasCashPrize === null ? 'All Prizes' : filters.hasCashPrize === true ? 'Has Prize' : 'No Prize'}
              </button>
            </div>
          </div>
        )}

        {/* Results Count - Only show when filtering or searching */}
        {(searchQuery ||
          filters.type !== null ||
          filters.structure !== null ||
          filters.isPremium !== null ||
          filters.hasCashPrize !== null) && (
          <div className="text-secondary mb-4">
            {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? "s" : ""} found
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="w-10 px-4 py-4">
                  <CustomCheckbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Tournament</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Type</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Participants</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Prize Pool</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Start Date</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTournaments.map((tournament) => {
                const status = calculateStatus(tournament.start_date, tournament.end_date);
                return (
                  <tr
                    key={tournament.id_tournament}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--overlay-hover)] cursor-pointer"
                    onClick={() => navigate(`/tournaments/${tournament.id_tournament}`)}
                  >
                    <td className="w-10 px-4 py-4" onClick={e => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedTournaments.includes(tournament.id_tournament)}
                        onChange={() => toggleTournamentSelection(tournament.id_tournament)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-oxymore-purple/10 flex items-center justify-center text-oxymore-purple">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-primary font-medium">{tournament.tournament_name}</p>
                          <p className="text-muted text-sm">{tournament.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-secondary">{tournament.type}</td>
                    <td className="px-4 py-4 text-secondary">{tournament.max_participant || 'N/A'}</td>
                    <td className="px-4 py-4 text-secondary">€{(tournament.cash_prize || 0).toLocaleString()}</td>
                    <td className="px-4 py-4 text-secondary">
                      {format(new Date(tournament.start_date), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip content="View tournament details">
                          <button
                            className="p-2 hover-overlay rounded-lg"
                            onClick={() => navigate(`/tournaments/${tournament.id_tournament}`)}
                          >
                            <HistoryIcon className="w-4 h-4 text-secondary" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Edit tournament">
                          <button
                            className="p-2 hover-overlay rounded-lg"
                            onClick={(e) => handleEdit(tournament.id_tournament, e)}
                          >
                            <Edit className="w-4 h-4 text-secondary" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete tournament">
                          <button
                            className="p-2 hover-overlay rounded-lg"
                            onClick={(e) => handleDeleteClick(tournament.id_tournament, e)}
                          >
                            <Trash className="w-4 h-4 text-red-400" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-[var(--card-background)] p-6 rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-primary mb-2">
              Delete Tournament
            </h3>
            <p className="text-secondary mb-6">
              Are you sure you want to delete the tournament "
              {tournaments.find(t => t.id_tournament === showDeleteConfirm)?.tournament_name}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="button-secondary px-4 py-2 rounded-xl order-2 sm:order-1"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors order-1 sm:order-2"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;

