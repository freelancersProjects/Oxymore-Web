import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trophy, ArrowLeft } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { League } from '../../../types/league';
import Dropdown, { DropdownOption } from '../../../components/Dropdown/Dropdown';

interface TournamentFormData {
  tournament_name: string;
  type: string;
  format: string;
  structure: string;
  id_league: string;
  description?: string;
  start_date: string;
  end_date: string;
  check_in_date?: string;
  min_participant: number;
  max_participant: number;
  entry_fee: number;
  cash_prize: number;
  is_premium?: boolean;
  image_url?: string;
  id_badge_winner?: string;
}

const Create = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<TournamentFormData>();

  // Dropdown options
  const typeOptions: DropdownOption[] = [
    { value: 'ligue', label: 'Ligue' },
    { value: 'major', label: 'Major' },
    { value: 'open', label: 'Open' }
  ];

  const formatOptions: DropdownOption[] = [
    { value: 'BO1', label: 'Best of 1' },
    { value: 'BO3', label: 'Best of 3' },
    { value: 'BO5', label: 'Best of 5' }
  ];

  const structureOptions: DropdownOption[] = [
    { value: 'single_elimination', label: 'Single Elimination' },
    { value: 'double_elimination', label: 'Double Elimination' },
    { value: 'round_robin', label: 'Round Robin' },
    { value: 'swiss', label: 'Swiss System' },
    { value: 'group_stage', label: 'Group Stage + Playoffs' }
  ];

  const leagueOptions: DropdownOption[] = leagues.map(league => ({
    value: league.id_league,
    label: league.league_name
  }));

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

  useEffect(() => {
    fetchLeagues();
  }, []);

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
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/tournaments')}
          className="p-2 hover:bg-[var(--overlay-hover)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Create Tournament</h1>
          <p className="text-secondary mt-1">Create a new tournament</p>
        </div>
      </div>

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
                placeholder="Enter tournament name"
              />
              {errors.tournament_name && <p className="text-red-400 text-sm mt-1">{errors.tournament_name.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="type">Tournament Type *</label>
              <Dropdown
                options={typeOptions}
                value={watch('type') || ''}
                onChange={(value) => setValue('type', value)}
                placeholder="Select type"
                className="w-full"
              />
              {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="format">Match Format *</label>
              <Dropdown
                options={formatOptions}
                value={watch('format') || ''}
                onChange={(value) => setValue('format', value)}
                placeholder="Select format"
                className="w-full"
              />
              {errors.format && <p className="text-red-400 text-sm mt-1">{errors.format.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="structure">Tournament Structure *</label>
              <Dropdown
                options={structureOptions}
                value={watch('structure') || ''}
                onChange={(value) => setValue('structure', value)}
                placeholder="Select structure"
                className="w-full"
              />
              {errors.structure && <p className="text-red-400 text-sm mt-1">{errors.structure.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="id_league">League *</label>
              <Dropdown
                options={leagueOptions}
                value={watch('id_league') || ''}
                onChange={(value) => setValue('id_league', value)}
                placeholder={loading ? 'Loading leagues...' : 'Select league'}
                disabled={loading}
                className="w-full"
              />
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

