import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Calendar,
  DollarSign,
  Award,
  Edit,
  Trash2,
  ArrowLeft,
  Play,
  Clock,
  CheckCircle,
  Shield
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Tournament } from '../../types/tournament';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Loader from '../../components/Loader/Loader';

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTournament();
    }
  }, [id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Tournament>(`/tournaments/${id}`);
      setTournament(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement du tournoi');
      console.error('Error fetching tournament:', err);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/tournaments')}
            className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Tournament Details</h1>
            <p className="text-secondary mt-1">Loading tournament information...</p>
          </div>
        </div>
        <Loader />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/tournaments')}
            className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Tournament Details</h1>
            <p className="text-secondary mt-1">Tournament not found</p>
          </div>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400 mb-4">{error || 'Tournament not found'}</p>
          <button
            onClick={() => navigate('/tournaments')}
            className="button-primary px-4 py-2 rounded-xl"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const status = calculateStatus(tournament.start_date, tournament.end_date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/tournaments')}
            className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary">{tournament.name}</h1>
            <p className="text-secondary mt-1">{tournament.game} • {tournament.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {status}
          </span>
          <button className="button-secondary px-4 py-2 rounded-xl flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button className="button-danger px-4 py-2 rounded-xl flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Tournament Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-secondary">Participants</p>
              <p className="text-xl font-bold text-primary">{tournament.participants_count}</p>
            </div>
          </div>
        </div>

        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center text-green-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-secondary">Prize Pool</p>
              <p className="text-xl font-bold text-primary">€{tournament.prize_pool.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-secondary">Start Date</p>
              <p className="text-xl font-bold text-primary">{format(new Date(tournament.start_date), 'dd MMM', { locale: fr })}</p>
            </div>
          </div>
        </div>

        <div className="card-base p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-secondary">Type</p>
              <p className="text-xl font-bold text-primary">{tournament.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Description</h2>
            <p className="text-secondary leading-relaxed">
              {tournament.description || 'No description available for this tournament.'}
            </p>
          </div>

          {/* Participants */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary">Participants</h2>
              <span className="text-sm text-secondary">{tournament.participants_count} registered</span>
            </div>
            <div className="space-y-3">
              {/* Mock participants - replace with real data */}
              {Array.from({ length: Math.min(5, tournament.participants_count) }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[var(--overlay-hover)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{String.fromCharCode(65 + i)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Team {String.fromCharCode(65 + i)}</p>
                      <p className="text-sm text-secondary">Member since {format(new Date(Date.now() - Math.random() * 10000000000), 'MMM yyyy', { locale: fr })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary">ELO: {Math.floor(Math.random() * 1000) + 1000}</span>
                    <Shield className="w-4 h-4 text-secondary" />
                  </div>
                </div>
              ))}
              {tournament.participants_count > 5 && (
                <div className="text-center py-3">
                  <p className="text-secondary text-sm">+{tournament.participants_count - 5} more participants</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tournament Status */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Tournament Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Start Date</span>
                <span className="text-primary font-medium">{format(new Date(tournament.start_date), 'dd MMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">End Date</span>
                <span className="text-primary font-medium">{format(new Date(tournament.end_date), 'dd MMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Registration</span>
                <span className="text-green-400 font-medium">Open</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full button-primary px-4 py-2 rounded-xl flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Tournament
              </button>
              <button className="w-full button-secondary px-4 py-2 rounded-xl flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage Participants
              </button>
              <button className="w-full button-secondary px-4 py-2 rounded-xl flex items-center gap-2">
                <Award className="w-4 h-4" />
                View Brackets
              </button>
              <button className="w-full button-secondary px-4 py-2 rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Matches
              </button>
            </div>
          </div>

          {/* Prize Distribution */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Prize Distribution</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[var(--overlay-hover)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold">1</span>
                  </div>
                  <span className="font-medium text-primary">1st Place</span>
                </div>
                <span className="font-bold text-primary">€{(tournament.prize_pool * 0.5).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--overlay-hover)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-400/10 flex items-center justify-center">
                    <span className="text-gray-400 font-bold">2</span>
                  </div>
                  <span className="font-medium text-primary">2nd Place</span>
                </div>
                <span className="font-bold text-primary">€{(tournament.prize_pool * 0.3).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--overlay-hover)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                    <span className="text-orange-400 font-bold">3</span>
                  </div>
                  <span className="font-medium text-primary">3rd Place</span>
                </div>
                <span className="font-bold text-primary">€{(tournament.prize_pool * 0.2).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
