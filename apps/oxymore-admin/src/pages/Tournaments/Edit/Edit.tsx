import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Trophy, Map as MapIcon, Upload } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { TournamentFormData, Tournament, League, Badge, GameMap } from '../../../types';
import Dropdown from '@/components/Dropdown/Dropdown';
import {
  typeTournamentOptions,
  formatTournamentOptions,
  structureTournamentOptions,
} from "@/types/options/tournamentOptions";
import Loader from '@/components/Loader/Loader';

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [maps, setMaps] = useState<GameMap[]>([]);
  const [selectedMaps, setSelectedMaps] = useState<GameMap[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [oldImagePublicId, setOldImagePublicId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TournamentFormData>();

  // Image upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const extractPublicIdFromUrl = (url: string): string | null => {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{ext}
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const handleImageFile = async (file: File) => {
    try {
      setUploadingImage(true);
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Convert to base64
      const base64Image = await convertFileToBase64(file);

      // Extract old public_id if exists
      const currentImageUrl = watch('image_url');
      const oldPublicId = currentImageUrl && currentImageUrl.includes('cloudinary.com') 
        ? extractPublicIdFromUrl(currentImageUrl)
        : null;

      // Upload to Cloudinary
      const response = await apiService.post<{ url: string; public_id: string }>('/cloudinary/upload', {
        image: base64Image,
        folder: 'oxymore/tournaments',
        type: 'banner',
        oldPublicId: oldPublicId
      });

      // Set the Cloudinary URL
      setUploadedImageUrl(response.url);
      setValue('image_url', response.url);
      setOldImagePublicId(response.public_id);
    } catch (error) {
      console.error('Error uploading image:', error);
      setPreviewImage(null);
      setValue('image_url', watch('image_url') || ''); // Keep old image if upload fails
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tournament data
      const tournamentData = await apiService.get<Tournament>(`/tournaments/${id}`);

      // Fetch leagues, badges, and maps
      const [leaguesData, badgesData, mapsData] = await Promise.all([
        apiService.get<League[]>('/leagues'),
        apiService.get<Badge[]>('/badges'),
        apiService.get<GameMap[]>('/maps')
      ]);

      setLeagues(leaguesData);
      setBadges(badgesData);
      setMaps(mapsData);

      // Pre-fill form with tournament data
      setValue('tournament_name', tournamentData.tournament_name);
      setValue('organized_by', tournamentData.organized_by || '');
      setValue('description', tournamentData.description || '');
      setValue('type', tournamentData.type);
      setValue('format', tournamentData.format);
      setValue('structure', tournamentData.structure);
      // Format dates for input[type="datetime-local"] (YYYY-MM-DDTHH:mm)
      const formatDateTimeLocal = (dateString: string | null): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Get local date/time components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      setValue('start_date', formatDateTimeLocal(tournamentData.start_date));
      setValue('end_date', formatDateTimeLocal(tournamentData.end_date));
      setValue('check_in_date', formatDateTimeLocal(tournamentData.check_in_date));
      setValue('cash_prize', tournamentData.cash_prize || 0);
      setValue('entry_fee', tournamentData.entry_fee || 0);
      setValue('max_participant', tournamentData.max_participant || 0);
      setValue('min_participant', tournamentData.min_participant || 0);
      setValue('is_premium', tournamentData.is_premium || false);
      setValue('image_url', tournamentData.image_url || '');
      setValue('id_league', tournamentData.id_league);
      setValue('id_badge_winner', tournamentData.id_badge_winner || '');

      // Set preview image if exists
      if (tournamentData.image_url) {
        setPreviewImage(tournamentData.image_url);
      }

      // Fetch tournament maps
      try {
        const tournamentMaps = await apiService.get<GameMap[]>(`/tournament-maps/${id}`);
        setSelectedMaps(tournamentMaps);
        setValue('selected_maps', tournamentMaps.map(map => map.id_map));
      } catch (err) {
        console.error('No maps found for this tournament');
        setSelectedMaps([]);
        setValue('selected_maps', []);
      }

    } catch (err) {
      setError('Une erreur est survenue lors du chargement des données');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapSelection = (map: GameMap) => {
    if (!selectedMaps.find(m => m.id_map === map.id_map)) {
      const newSelectedMaps = [...selectedMaps, map];
      setSelectedMaps(newSelectedMaps);
      setValue('selected_maps', newSelectedMaps.map(m => m.id_map));
    }
  };

  const removeMap = (mapId: string) => {
    const newSelectedMaps = selectedMaps.filter(m => m.id_map !== mapId);
    setSelectedMaps(newSelectedMaps);
    setValue('selected_maps', newSelectedMaps.map(m => m.id_map));
  };

  const onSubmit = async (data: TournamentFormData) => {
    try {
      setSaving(true);
      setError(null);

      if (!data.tournament_name || !data.type || !data.format || !data.structure ||
          !data.start_date || !data.end_date || !data.id_league) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      await apiService.put(`/tournaments/${id}`, data);

      if (data.selected_maps && data.selected_maps.length > 0) {
        await apiService.delete(`/tournament-maps/${id}`);

        for (const mapId of data.selected_maps) {
          await apiService.post('/tournament-maps', {
            id_tournament: id,
            id_map: mapId
          });
        }
      }

      navigate(`/tournaments/${id}`, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du tournoi');
      console.error('Error updating tournament:', err);
    } finally {
      setSaving(false);
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
            <h1 className="text-2xl font-bold text-primary">Edit Tournament</h1>
            <p className="text-secondary mt-1">Loading tournament data...</p>
          </div>
        </div>
        <Loader />
      </div>
    );
  }

  if (error) {
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
            <h1 className="text-2xl font-bold text-primary">Edit Tournament</h1>
            <p className="text-secondary mt-1">Error loading tournament</p>
          </div>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/tournaments")}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Edit Tournament</h1>
          <p className="text-secondary mt-1">Update tournament information</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card-base p-4 bg-red-400/10 border border-red-400/20">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tournament Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Tournament Name *
              </label>
              <input
                {...register("tournament_name", { required: true })}
                className="input-base w-full"
                placeholder="Enter tournament name"
              />
              {errors.tournament_name && (
                <p className="text-red-400 text-sm mt-1">
                  Tournament name is required
                </p>
              )}
            </div>

            {/* Organized By */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Organized By
              </label>
              <input
                {...register("organized_by")}
                className="input-base w-full"
                placeholder="Enter organizer name"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Type *
              </label>
              <Dropdown
                options={typeTournamentOptions}
                value={watch("type") || ""}
                onChange={(value) => setValue("type", value)}
                placeholder="Select tournament type"
              />
              {errors.type && (
                <p className="text-red-400 text-sm mt-1">Type is required</p>
              )}
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Format *
              </label>
              <Dropdown
                options={formatTournamentOptions}
                value={watch("format") || ""}
                onChange={(value) => setValue("format", value)}
                placeholder="Select match format"
              />
              {errors.format && (
                <p className="text-red-400 text-sm mt-1">Format is required</p>
              )}
            </div>

            {/* Structure */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Structure *
              </label>
              <Dropdown
                options={structureTournamentOptions}
                value={watch("structure") || ""}
                onChange={(value) => setValue("structure", value)}
                placeholder="Select tournament structure"
              />
              {errors.structure && (
                <p className="text-red-400 text-sm mt-1">
                  Structure is required
                </p>
              )}
            </div>

            {/* League */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                League *
              </label>
              <Dropdown
                options={leagues.map((league) => ({
                  value: league.id_league,
                  label: league.league_name,
                }))}
                value={watch("id_league") || ""}
                onChange={(value) => setValue("id_league", value)}
                placeholder="Select league"
              />
              {errors.id_league && (
                <p className="text-red-400 text-sm mt-1">League is required</p>
              )}
            </div>

            {/* Winner Badge */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Winner Badge
              </label>
              <Dropdown
                options={badges.map((badge) => ({
                  value: badge.id_badge,
                  label: badge.badge_name,
                }))}
                value={watch("id_badge_winner") || ""}
                onChange={(value) => setValue("id_badge_winner", value)}
                placeholder="Select winner badge"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-secondary mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="input-base w-full h-24 resize-none"
              placeholder="Enter tournament description"
            />
          </div>
        </div>

        {/* Tournament Image */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Tournament Image
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">
              Tournament Image
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-oxymore-purple bg-oxymore-purple/5"
                  : "border-[var(--border-color)]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewImage ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={previewImage}
                    alt="Tournament preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setUploadedImageUrl(null);
                      setValue("image_url", watch('image_url') || "");
                      if (previewImage && previewImage.startsWith('blob:')) {
                        URL.revokeObjectURL(previewImage);
                      }
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-sm">Uploading...</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {uploadingImage ? (
                    <>
                      <Loader />
                      <p className="text-[var(--text-secondary)]">Uploading image...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                      <p className="text-[var(--text-secondary)]">
                        Drag and drop an image, or{" "}
                        <label className="text-oxymore-purple cursor-pointer hover:text-oxymore-purple/80 transition-colors">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileInput}
                            disabled={uploadingImage}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Recommended: 1200x675px, max 5MB
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Tournament Dates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Start Date * (Date & Time)
              </label>
              <input
                {...register("start_date", { required: true })}
                type="datetime-local"
                className="input-base w-full"
              />
              {errors.start_date && (
                <p className="text-red-400 text-sm mt-1">
                  Start date is required
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                End Date * (Date & Time)
              </label>
              <input
                {...register("end_date", { required: true })}
                type="datetime-local"
                className="input-base w-full"
              />
              {errors.end_date && (
                <p className="text-red-400 text-sm mt-1">
                  End date is required
                </p>
              )}
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Check-in Date (Date & Time)
              </label>
              <input
                {...register("check_in_date")}
                type="datetime-local"
                className="input-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Prize & Participants */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Prize & Participants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Cash Prize (€)
              </label>
              <input
                {...register("cash_prize", { valueAsNumber: true })}
                type="number"
                min="0"
                className="input-base w-full"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Entry Fee (€)
              </label>
              <input
                {...register("entry_fee", { valueAsNumber: true })}
                type="number"
                min="0"
                className="input-base w-full"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Max Participants
              </label>
              <input
                {...register("max_participant", { valueAsNumber: true })}
                type="number"
                min="1"
                className="input-base w-full"
                placeholder="Enter max participants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Min Participants
              </label>
              <input
                {...register("min_participant", { valueAsNumber: true })}
                type="number"
                min="1"
                className="input-base w-full"
                placeholder="Enter min participants"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3">
              <input
                {...register("is_premium")}
                type="checkbox"
                className="w-4 h-4 text-oxymore-purple bg-transparent border-gray-300 rounded focus:ring-oxymore-purple focus:ring-2"
              />
              <span className="text-sm font-medium text-secondary">
                Premium Tournament
              </span>
            </label>
          </div>
        </div>

        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Tournament Maps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Available Maps
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {maps.map((map) => (
                  <div
                    key={map.id_map}
                    className="flex items-center justify-between p-3 bg-[var(--overlay-hover)] rounded-xl cursor-pointer hover:bg-[var(--overlay-active)] transition-colors"
                    onClick={() => handleMapSelection(map)}
                  >
                    <div className="flex items-center gap-3">
                      <MapIcon className="w-4 h-4 text-secondary" />
                      <span className="text-primary">{map.map_name}</span>
                    </div>
                    {selectedMaps.find((m) => m.id_map === map.id_map) && (
                      <span className="text-green-400 text-sm">✓ Selected</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Selected Maps ({selectedMaps.length})
              </label>
              <div className="space-y-2">
                {selectedMaps.map((map) => (
                  <div
                    key={map.id_map}
                    className="flex items-center justify-between p-3 bg-green-400/10 border border-green-400/20 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <MapIcon className="w-4 h-4 text-green-400" />
                      <span className="text-primary">{map.map_name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMap(map.id_map)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedMaps.length === 0 && (
                  <p className="text-secondary text-sm italic">
                    No maps selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/tournaments")}
            className="button-secondary px-6 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="button-primary px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            <Trophy className="w-4 h-4" />
            {saving ? "Updating..." : "Update Tournament"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
