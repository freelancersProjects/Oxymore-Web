import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trophy, Users, Calendar, Star, Clock } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { League } from '../../../types/league';

const Details = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLeague();
    }
  }, [id]);

  const fetchLeague = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<League>(`/leagues/${id}`);
      setLeague(data);
    } catch (error) {
      console.error('Error fetching league:', error);
      navigate('/leagues');
    } finally {
      setLoading(false);
    }
  };

  const getLeagueStatus = () => {
    if (!league) return { status: 'unknown', text: 'UNKNOWN', color: 'bg-gray-500/10 text-gray-500' };

    const now = new Date();
    const startDate = league.start_date ? new Date(league.start_date) : null;
    const endDate = league.end_date ? new Date(league.end_date) : null;

    if (startDate && now >= startDate) {
      if (endDate && now > endDate) {
        return { status: 'ended', text: 'ENDED', color: 'bg-gray-500/10 text-gray-500' };
      } else {
        return { status: 'active', text: 'LIVE', color: 'bg-green-500/10 text-green-500' };
      }
    } else {
      return { status: 'upcoming', text: 'UPCOMING', color: 'bg-blue-500/10 text-blue-500' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-oxymore-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!league) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">League not found</p>
      </div>
    );
  }

  const status = getLeagueStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/leagues')}
            className="button-secondary p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{league.league_name}</h1>
            <p className="text-[var(--text-secondary)] mt-1">League details and information</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/leagues/${id}/edit`)}
          className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit League
        </button>
      </div>

      {/* League Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-base p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-oxymore flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Status</p>
              <div className={`px-3 py-1 ${status.color} rounded-full text-sm font-medium inline-block mt-1`}>
                {status.text}
              </div>
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Maximum Teams</p>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{league.max_teams || 0}</h3>
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Entry Type</p>
              <h3 className="text-xl font-bold text-[var(--text-primary)] capitalize">{league.entry_type || 'N/A'}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">League Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-[var(--text-secondary)] text-sm">League Name</label>
              <p className="text-[var(--text-primary)] font-medium">{league.league_name}</p>
            </div>

            <div>
              <label className="text-[var(--text-secondary)] text-sm">Start Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-[var(--text-primary)] font-medium">
                  {league.start_date ? new Date(league.start_date).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[var(--text-secondary)] text-sm">End Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-[var(--text-primary)] font-medium">
                  {league.end_date ? new Date(league.end_date).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[var(--text-secondary)] text-sm">Promotion Slots</label>
              <p className="text-[var(--text-primary)] font-medium">{league.promotion_slots || 0}</p>
            </div>

            <div>
              <label className="text-[var(--text-secondary)] text-sm">Relegation Slots</label>
              <p className="text-[var(--text-primary)] font-medium">{league.relegation_slots || 0}</p>
            </div>

            <div>
              <label className="text-[var(--text-secondary)] text-sm">Entry Type</label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-[var(--text-primary)] font-medium capitalize">{league.entry_type || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {league.image_url && (
          <div className="mt-6">
            <label className="text-[var(--text-secondary)] text-sm">League Image</label>
            <div className="mt-2">
              <img
                src={league.image_url}
                alt={league.league_name}
                className="w-32 h-32 object-cover rounded-xl border border-[var(--border-color)]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
