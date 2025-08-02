import { useState, useEffect } from 'react';
import {
  Trophy,
  Search,
  Filter,
  Edit,
  Trash,
  ArrowUpRight,
  ArrowDownRight,
  History as HistoryIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CustomCheckbox } from '../../components/CustomCheckbox/CustomCheckbox';
import { apiService } from '../../api/apiService';
import { Tournament } from '../../types/tournament';
import { format } from 'date-fns';
import Loader from '../../components/Loader/Loader';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Tournament[]>('/tournaments');
      setTournaments(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des tournois');
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
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
      value: `€${tournaments.reduce((sum, t) => sum + t.prize_pool, 0).toLocaleString()}`,
      change: '+5%',
      trend: 'up',
      color: 'bg-gradient-oxymore'
    }
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedTournaments(checked ? tournaments.map(t => t.id_tournament) : []);
  };

  const toggleTournamentSelection = (tournamentId: string) => {
    setSelectedTournaments(prev => {
      const newSelection = prev.includes(tournamentId)
        ? prev.filter(id => id !== tournamentId)
        : [...prev, tournamentId];

      setSelectAll(newSelection.length === tournaments.length);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-1">Manage and monitor tournaments</p>
        </div>
        <button
          onClick={() => navigate('/tournaments/create')}
          className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
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

      {/* Search & Table */}
      <div className="card-base p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search tournaments..."
              className="input-base w-full pl-10"
            />
          </div>
          <button className="button-secondary px-4 py-2 rounded-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>

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
              {tournaments.map((tournament) => {
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
                          <p className="text-primary font-medium">{tournament.name}</p>
                          <p className="text-muted text-sm">{tournament.game}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                    </span>
                  </td>
                    <td className="px-4 py-4 text-secondary">{tournament.type}</td>
                    <td className="px-4 py-4 text-secondary">{tournament.participants_count}</td>
                    <td className="px-4 py-4 text-secondary">€{tournament.prize_pool.toLocaleString()}</td>
                    <td className="px-4 py-4 text-secondary">
                      {format(new Date(tournament.start_date), 'yyyy-MM-dd')}
                  </td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover-overlay rounded-lg">
                        <Edit className="w-4 h-4 text-secondary" />
                      </button>
                        <button className="p-2 hover-overlay rounded-lg">
                          <HistoryIcon className="w-4 h-4 text-secondary" />
                        </button>
                      <button className="p-2 hover-overlay rounded-lg">
                        <Trash className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;

