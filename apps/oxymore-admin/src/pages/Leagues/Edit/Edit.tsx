import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiService } from '../../../api/apiService';
import { League } from '../../../types/league';
import { Badge } from '../../../types/badge';
import Dropdown, { DropdownOption } from '../../../components/Dropdown/Dropdown';

interface LeagueFormData {
  league_name: string;
  max_teams?: number;
  start_date?: string;
  end_date?: string;
  promotion_slots?: number;
  relegation_slots?: number;
  image_url?: string;
  entry_type?: string; // 'inscription' | 'promotion'
  id_badge_champion?: string;
}

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LeagueFormData>();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Dropdown options for badges
  const badgeOptions: DropdownOption[] = badges.map(badge => ({
    value: badge.id_badge,
    label: badge.badge_name
  }));

  // Dropdown options for entry type
  const entryTypeOptions: DropdownOption[] = [
    { value: 'inscription', label: 'Inscription' },
    { value: 'promotion', label: 'Promotion' }
  ];

  // Récupérer les badges
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const badgesData = await apiService.get<Badge[]>('/badges');
        setBadges(badgesData);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchBadges();
  }, []);

  // Récupérer la league
  useEffect(() => {
    if (id) {
      fetchLeague();
    }
  }, [id]);

    const fetchLeague = async () => {
    try {
      setInitialLoading(true);
      const league = await apiService.get<League>(`/leagues/${id}`);

      // Pré-remplir le formulaire
      setValue('league_name', league.league_name || '');
      setValue('max_teams', league.max_teams || 0);
      setValue('start_date', league.start_date ? new Date(league.start_date).toISOString().slice(0, 16) : '');
      setValue('end_date', league.end_date ? new Date(league.end_date).toISOString().slice(0, 16) : '');
      setValue('promotion_slots', league.promotion_slots || 0);
      setValue('relegation_slots', league.relegation_slots || 0);
      setValue('entry_type', league.entry_type || 'inscription');
      setValue('image_url', league.image_url || '');
      setValue('id_badge_champion', league.id_badge_champion || '');
    } catch (error) {
      console.error('Error fetching league:', error);
      // Ne pas rediriger automatiquement, laisser l'utilisateur décider
    } finally {
      setInitialLoading(false);
    }
  };

  // Gérer la sélection d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: LeagueFormData) => {
    setLoading(true);
    try {
      // Si une image est sélectionnée, l'uploader d'abord
      let imageUrl = data.image_url;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
          const uploadResponse = await apiService.post<{ url: string }>('/upload', formData);
          imageUrl = uploadResponse.url;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continuer sans l'image si l'upload échoue
        }
      }

      // Mettre à jour la ligue avec l'URL de l'image
      await apiService.put(`/leagues/${id}`, {
        ...data,
        image_url: imageUrl
      });
      navigate('/leagues');
    } catch (error) {
      console.error('Error updating league:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-oxymore-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si on a une erreur lors du chargement, afficher un message
  if (!initialLoading && !watch('league_name')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/leagues"
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit League</h1>
        </div>
        <div className="card-base p-6">
          <div className="text-center">
            <p className="text-[var(--text-secondary)] mb-4">Impossible de charger les données de la league</p>
            <button
              onClick={() => navigate('/leagues')}
              className="button-secondary px-4 py-2 rounded-xl"
            >
              Retour aux leagues
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/leagues"
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit League</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-base" htmlFor="league_name">League Name *</label>
              <input
                {...register('league_name', { required: 'League name is required' })}
                type="text"
                id="league_name"
                className="input-base w-full"
                placeholder="e.g. Premier League"
              />
              {errors.league_name && <p className="text-red-400 text-sm mt-1">{errors.league_name.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="entry_type">Entry Type</label>
              <Dropdown
                options={entryTypeOptions}
                value={watch('entry_type') || ''}
                onChange={(value) => setValue('entry_type', value)}
                placeholder="Select entry type"
                className="w-full"
              />
            </div>

            <div>
              <label className="label-base" htmlFor="max_teams">Maximum Teams</label>
              <input
                {...register('max_teams', {
                  min: { value: 2, message: 'Minimum 2 teams required' }
                })}
                type="number"
                id="max_teams"
                className="input-base w-full"
                min="2"
                placeholder="e.g. 16"
              />
              {errors.max_teams && <p className="text-red-400 text-sm mt-1">{errors.max_teams.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="promotion_slots">Promotion Slots</label>
              <input
                {...register('promotion_slots', {
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                type="number"
                id="promotion_slots"
                className="input-base w-full"
                min="0"
                placeholder="e.g. 2"
              />
              {errors.promotion_slots && <p className="text-red-400 text-sm mt-1">{errors.promotion_slots.message}</p>}
            </div>

            <div>
              <label className="label-base" htmlFor="relegation_slots">Relegation Slots</label>
              <input
                {...register('relegation_slots', {
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                type="number"
                id="relegation_slots"
                className="input-base w-full"
                min="0"
                placeholder="e.g. 2"
              />
              {errors.relegation_slots && <p className="text-red-400 text-sm mt-1">{errors.relegation_slots.message}</p>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-base" htmlFor="start_date">Start Date</label>
              <input
                {...register('start_date')}
                type="datetime-local"
                id="start_date"
                className="input-base w-full"
              />
            </div>

            <div>
              <label className="label-base" htmlFor="end_date">End Date</label>
              <input
                {...register('end_date')}
                type="datetime-local"
                id="end_date"
                className="input-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Additional Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="label-base" htmlFor="league_image">League Image</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-lg transition-colors">
                    <Upload className="w-4 h-4" />
                    Choose File
                    <input
                      type="file"
                      id="league_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-[var(--text-secondary)]">
                      {selectedImage.name}
                    </span>
                  )}
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-[var(--border-color)]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="label-base" htmlFor="id_badge_champion">Champion Badge</label>
              <Dropdown
                options={badgeOptions}
                value={watch('id_badge_champion') || ''}
                onChange={(value) => setValue('id_badge_champion', value)}
                placeholder="Select a badge (optional)"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/leagues')}
            className="button-secondary px-4 py-2 rounded-xl"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5" />
                Update League
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
