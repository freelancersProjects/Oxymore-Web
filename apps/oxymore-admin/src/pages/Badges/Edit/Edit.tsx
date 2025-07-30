import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiService } from '../../../api/apiService';
import { Badge } from '../../../types/badge';
import Loader from '../../../components/Loader/Loader';

interface BadgeFormData {
  badge_name: string;
  badge_description: string;
  unlock_condition: string;
  image_url: string;
}

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BadgeFormData>();
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBadge();
  }, [id]);

  const fetchBadge = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Badge>(`/badges/${id}`);
      reset({
        badge_name: data.badge_name,
        badge_description: data.badge_description || '',
        unlock_condition: data.unlock_condition || '',
        image_url: data.image_url || ''
      });
      setPreviewImage(data.image_url);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement du badge');
      console.error('Error fetching badge:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageFile = (file: File) => {
    // Pour l'instant, on crée juste une URL locale pour la prévisualisation
    // Plus tard, on utilisera Cloudinary ici
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  const onSubmit = async (data: BadgeFormData) => {
    if (!id) return;
    try {
      const formData = {
        ...data,
        image_url: previewImage
      };
      await apiService.patch(`/badges/${id}`, formData);
      navigate('/badges');
    } catch (error) {
      console.error('Error updating badge:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Edit Badge</h1>
          <p className="text-secondary mt-1">Modify badge details</p>
        </div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Edit Badge</h1>
          <p className="text-secondary mt-1">Modify badge details</p>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBadge}
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
        <div className="flex items-center gap-4">
          <Link
            to="/badges"
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Badge</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Badge Information</h2>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="label-base">Badge Image</label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-oxymore-purple bg-oxymore-purple/5'
                  : 'border-[var(--border-color)]'
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
                    alt="Badge preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                  <p className="text-[var(--text-secondary)]">
                    Drag and drop an image, or{' '}
                    <label className="text-oxymore-purple cursor-pointer">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileInput}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Recommended: 512x512px, max 2MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Badge Details */}
          <div className="space-y-4">
            <div>
              <label className="label-base" htmlFor="badge_name">Badge Name</label>
              <input
                {...register('badge_name', { required: 'Badge name is required' })}
                type="text"
                id="badge_name"
                className="input-base w-full"
                placeholder="e.g. Tournament Winner"
              />
              {errors.badge_name && (
                <p className="text-red-400 text-sm mt-1">{errors.badge_name.message}</p>
              )}
            </div>

            <div>
              <label className="label-base" htmlFor="badge_description">Description</label>
              <textarea
                {...register('badge_description', { required: 'Description is required' })}
                id="badge_description"
                rows={3}
                className="input-base w-full"
                placeholder="Describe what this badge represents..."
              />
              {errors.badge_description && (
                <p className="text-red-400 text-sm mt-1">{errors.badge_description.message}</p>
              )}
            </div>

            <div>
              <label className="label-base" htmlFor="unlock_condition">Unlock Condition</label>
              <textarea
                {...register('unlock_condition', { required: 'Unlock condition is required' })}
                id="unlock_condition"
                rows={2}
                className="input-base w-full"
                placeholder="e.g. Win 3 tournaments in a row"
              />
              {errors.unlock_condition && (
                <p className="text-red-400 text-sm mt-1">{errors.unlock_condition.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/badges')}
            className="button-secondary px-4 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit; 