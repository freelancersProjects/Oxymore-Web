import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiService } from '../../../api/apiService';
import { League } from '../../../types/league';

interface TournamentFormData {
  tournament_name: string;
  organized_by?: string;
  description?: string;
  type: string; // 'ligue' | 'major' | 'open'
  format: string; // 'BO1' | 'BO3' | 'BO5'
  structure: string;
  start_date: string;
  end_date: string;
  check_in_date?: string;
  cash_prize?: number;
  entry_fee?: number;
  max_participant?: number;
  min_participant?: number;
  is_premium?: boolean;
  image_url?: string;
  id_league: string;
  id_badge_winner?: string;
}

const Create = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<TournamentFormData>();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<League[]>('/leagues');
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TournamentFormData) => {
    try {
      await apiService.post('/tournaments', data);
      navigate('/tournaments');
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/tournaments"
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Tournament</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-base" htmlFor="tournament_name">Tournament Name *</label>
              <input
                {...register('tournament_name', { required: 'Tournament name is required' })}
                type="text"
                id="tournament_name"
                className="input-base w-full"
                placeholder="e.g. Summer Championship 2024"
              />
              {errors.tournament_name && <p className="text-red-400 text-sm mt-1">{errors.tournament_name.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="organized_by">Organized By</label>
              <input
                {...register('organized_by')}
                type="text"
                id="organized_by"
                className="input-base w-full"
                placeholder="e.g. Oxymore Gaming"
              />
            </div>

            <div>
              <label className="label-base" htmlFor="type">Tournament Type *</label>
              <select
                {...register('type', { required: 'Tournament type is required' })}
                id="type"
                className="input-base w-full"
              >
                <option value="">Select type</option>
                <option value="ligue">Ligue</option>
                <option value="major">Major</option>
                <option value="open">Open</option>
              </select>
              {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="format">Match Format *</label>
              <select
                {...register('format', { required: 'Match format is required' })}
                id="format"
                className="input-base w-full"
              >
                <option value="">Select format</option>
                <option value="BO1">Best of 1</option>
                <option value="BO3">Best of 3</option>
                <option value="BO5">Best of 5</option>
              </select>
              {errors.format && <p className="text-red-400 text-sm mt-1">{errors.format.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="structure">Tournament Structure *</label>
              <select
                {...register('structure', { required: 'Tournament structure is required' })}
                id="structure"
                className="input-base w-full"
              >
                <option value="">Select structure</option>
                <option value="single_elimination">Single Elimination</option>
                <option value="double_elimination">Double Elimination</option>
                <option value="round_robin">Round Robin</option>
                <option value="swiss">Swiss System</option>
                <option value="group_stage">Group Stage + Playoffs</option>
              </select>
              {errors.structure && <p className="text-red-400 text-sm mt-1">{errors.structure.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="id_league">League *</label>
              <select
                {...register('id_league', { required: 'League is required' })}
                id="id_league"
                className="input-base w-full"
                disabled={loading}
              >
                <option value="">{loading ? 'Loading leagues...' : 'Select league'}</option>
                {leagues.map((league) => (
                  <option key={league.id_league} value={league.id_league}>
                    {league.league_name}
                  </option>
                ))}
              </select>
              {errors.id_league && <p className="text-red-400 text-sm mt-1">{errors.id_league.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="label-base" htmlFor="description">Description</label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="input-base w-full"
              placeholder="Tournament description..."
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-base" htmlFor="start_date">Start Date *</label>
              <input
                {...register('start_date', { required: 'Start date is required' })}
                type="datetime-local"
                id="start_date"
                className="input-base w-full"
              />
              {errors.start_date && <p className="text-red-400 text-sm mt-1">{errors.start_date.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="end_date">End Date *</label>
              <input
                {...register('end_date', { required: 'End date is required' })}
                type="datetime-local"
                id="end_date"
                className="input-base w-full"
              />
              {errors.end_date && <p className="text-red-400 text-sm mt-1">{errors.end_date.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="check_in_date">Check-in Date</label>
              <input
                {...register('check_in_date')}
                type="datetime-local"
                id="check_in_date"
                className="input-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Participants & Prizes */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Participants & Prizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-base" htmlFor="min_participant">Minimum Participants</label>
              <input
                {...register('min_participant', { 
                  min: { value: 2, message: 'Minimum 2 participants required' }
                })}
                type="number"
                id="min_participant"
                className="input-base w-full"
                min="2"
                placeholder="e.g. 8"
              />
              {errors.min_participant && <p className="text-red-400 text-sm mt-1">{errors.min_participant.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="max_participant">Maximum Participants</label>
              <input
                {...register('max_participant', { 
                  min: { value: 2, message: 'Minimum 2 participants required' }
                })}
                type="number"
                id="max_participant"
                className="input-base w-full"
                min="2"
                placeholder="e.g. 32"
              />
              {errors.max_participant && <p className="text-red-400 text-sm mt-1">{errors.max_participant.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="entry_fee">Entry Fee (€)</label>
              <input
                {...register('entry_fee', { 
                  min: { value: 0, message: 'Entry fee cannot be negative' }
                })}
                type="number"
                id="entry_fee"
                className="input-base w-full"
                min="0"
                step="0.01"
                placeholder="e.g. 10.00"
              />
              {errors.entry_fee && <p className="text-red-400 text-sm mt-1">{errors.entry_fee.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="cash_prize">Cash Prize (€)</label>
              <input
                {...register('cash_prize', { 
                  min: { value: 0, message: 'Cash prize cannot be negative' }
                })}
                type="number"
                id="cash_prize"
                className="input-base w-full"
                min="0"
                step="0.01"
                placeholder="e.g. 1000.00"
              />
              {errors.cash_prize && <p className="text-red-400 text-sm mt-1">{errors.cash_prize.message}</p>}
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Additional Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <input
                {...register('is_premium')}
                type="checkbox"
                id="is_premium"
                className="checkbox-base"
              />
              <label className="label-base cursor-pointer" htmlFor="is_premium">
                Premium Tournament
              </label>
            </div>

            <div>
              <label className="label-base" htmlFor="image_url">Tournament Image URL</label>
              <input
                {...register('image_url')}
                type="url"
                id="image_url"
                className="input-base w-full"
                placeholder="https://example.com/tournament-image.jpg"
              />
            </div>

            <div>
              <label className="label-base" htmlFor="id_badge_winner">Winner Badge ID</label>
              <input
                {...register('id_badge_winner')}
                type="text"
                id="id_badge_winner"
                className="input-base w-full"
                placeholder="e.g. badge_winner_123"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/tournaments')}
            className="button-secondary px-4 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Create Tournament
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create; 
 
 