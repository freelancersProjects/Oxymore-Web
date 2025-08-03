import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Search, Filter, Pencil, Trash2, X } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Badge } from '../../types/badge';
import Loader from '../../components/Loader/Loader';

interface FilterState {
  hasImage: boolean | null;
  hasDescription: boolean | null;
  hasUnlockCondition: boolean | null;
}

const Badges = () => {
  const navigate = useNavigate();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    hasImage: null,
    hasDescription: null,
    hasUnlockCondition: null
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  useEffect(() => {
    filterBadges();
  }, [badges, searchQuery, filters]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Badge[]>('/badges');
      setBadges(data);
      setFilteredBadges(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des badges');
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBadges = () => {
    let result = [...badges];

    // Recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(badge =>
        badge.badge_name.toLowerCase().includes(query) ||
        badge.badge_description?.toLowerCase().includes(query) ||
        badge.unlock_condition?.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (filters.hasImage !== null) {
      result = result.filter(badge =>
        filters.hasImage ? !!badge.image_url : !badge.image_url
      );
    }
    if (filters.hasDescription !== null) {
      result = result.filter(badge =>
        filters.hasDescription ? !!badge.badge_description : !badge.badge_description
      );
    }
    if (filters.hasUnlockCondition !== null) {
      result = result.filter(badge =>
        filters.hasUnlockCondition ? !!badge.unlock_condition : !badge.unlock_condition
      );
    }

    setFilteredBadges(result);
  };

  const handleDelete = async (badgeId: string) => {
    try {
      await apiService.delete(`/badges/${badgeId}`);
      setBadges(badges.filter(badge => badge.id_badge !== badgeId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting badge:', err);
    }
  };

  const handleEdit = (badgeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/badges/edit/${badgeId}`);
  };

  const handleDeleteClick = (badgeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirm(badgeId);
  };

  const toggleFilter = (key: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === null ? true : prev[key] === true ? false : null
    }));
  };

  const getFilterButtonClass = (value: boolean | null) => {
    if (value === null) return 'text-secondary bg-[var(--overlay-hover)]';
    if (value === true) return 'text-green-400 bg-green-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const clearFilters = () => {
    setFilters({
      hasImage: null,
      hasDescription: null,
      hasUnlockCondition: null
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Badges</h1>
          <p className="text-secondary mt-1">Manage and create badges</p>
        </div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Badges</h1>
          <p className="text-secondary mt-1">Manage and create badges</p>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBadges}
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
          <h1 className="text-2xl font-bold text-primary">Badges</h1>
          <p className="text-secondary mt-1">Manage and create badges</p>
        </div>
        <button
          onClick={() => navigate("/badges/create")}
          className="button-primary px-4 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Create Badge
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges..."
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
            {(filters.hasImage !== null ||
              filters.hasDescription !== null ||
              filters.hasUnlockCondition !== null) && (
              <span className="w-2 h-2 rounded-full bg-oxymore-purple absolute -top-1 -right-1" />
            )}
          </button>

          {/* Filter Menu */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--card-background)] rounded-xl shadow-lg border border-[var(--border-color)] p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => toggleFilter("hasImage")}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${getFilterButtonClass(
                    filters.hasImage
                  )}`}
                >
                  {filters.hasImage === null && "Any image status"}
                  {filters.hasImage === true && "Has image"}
                  {filters.hasImage === false && "No image"}
                </button>

                <button
                  onClick={() => toggleFilter("hasDescription")}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${getFilterButtonClass(
                    filters.hasDescription
                  )}`}
                >
                  {filters.hasDescription === null && "Any description status"}
                  {filters.hasDescription === true && "Has description"}
                  {filters.hasDescription === false && "No description"}
                </button>

                <button
                  onClick={() => toggleFilter("hasUnlockCondition")}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${getFilterButtonClass(
                    filters.hasUnlockCondition
                  )}`}
                >
                  {filters.hasUnlockCondition === null && "Any unlock condition status"}
                  {filters.hasUnlockCondition === true && "Has unlock condition"}
                  {filters.hasUnlockCondition === false && "No unlock condition"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(filters.hasImage !== null ||
        filters.hasDescription !== null ||
        filters.hasUnlockCondition !== null) && (
        <div className="flex flex-wrap gap-2">
          {filters.hasImage !== null && (
            <div className="px-3 py-1 bg-[var(--overlay-hover)] rounded-full text-sm flex items-center gap-2">
              <span>{filters.hasImage ? "Has image" : "No image"}</span>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, hasImage: null }))
                }
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.hasDescription !== null && (
            <div className="px-3 py-1 bg-[var(--overlay-hover)] rounded-full text-sm flex items-center gap-2">
              <span>
                {filters.hasDescription ? "Has description" : "No description"}
              </span>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, hasDescription: null }))
                }
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.hasUnlockCondition !== null && (
            <div className="px-3 py-1 bg-[var(--overlay-hover)] rounded-full text-sm flex items-center gap-2">
              <span>
                {filters.hasUnlockCondition
                  ? "Has unlock condition"
                  : "No unlock condition"}
              </span>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, hasUnlockCondition: null }))
                }
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count - Only show when filtering or searching */}
      {(searchQuery ||
        filters.hasImage !== null ||
        filters.hasDescription !== null ||
        filters.hasUnlockCondition !== null) && (
        <div className="text-secondary">
          {filteredBadges.length} badge{filteredBadges.length !== 1 ? "s" : ""}{" "}
          found
        </div>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id_badge}
            className="card-base p-6 group relative cursor-pointer transition-all duration-200"
          >
            {/* Badge Image */}
            <div className="aspect-square rounded-2xl bg-[var(--overlay-hover)] mb-4 flex items-center justify-center overflow-hidden">
              {badge.image_url ? (
                <img
                  src={badge.image_url}
                  alt={badge.badge_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Shield className="w-12 h-12 text-muted" />
              )}
            </div>

            {/* Badge Info */}
            <div className="mb-4">
              <h3 className="font-semibold text-primary mb-1">
                {badge.badge_name}
              </h3>
              {badge.badge_description && (
                <p className="text-secondary text-sm line-clamp-2">
                  {badge.badge_description}
                </p>
              )}
              {badge.unlock_condition && (
                <p className="text-xs text-muted mt-2 italic">
                  Unlock condition: {badge.unlock_condition}
                </p>
              )}
            </div>

            {/* Action Buttons - Always Visible */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(badge.id_badge, e);
                }}
                className="flex-1 p-2 bg-oxymore-purple/10 hover:bg-oxymore-purple/20 text-oxymore-purple rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(badge.id_badge, e);
                }}
                className="flex-1 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm === badge.id_badge && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowDeleteConfirm(null)}
              >
                <div
                  className="bg-[var(--card-background)] p-6 rounded-2xl max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Delete Badge
                  </h3>
                  <p className="text-secondary mb-6">
                    Are you sure you want to delete the badge "
                    {badge.badge_name}"? This action cannot be undone.
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
                      onClick={() => handleDelete(badge.id_badge)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;

