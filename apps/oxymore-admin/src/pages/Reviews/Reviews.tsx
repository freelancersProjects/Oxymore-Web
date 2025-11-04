import { useState, useEffect } from 'react';
import { MessageSquare, Search, Star, Trash2, X } from 'lucide-react';
import { apiService } from '../../api/apiService';
import Loader from '../../components/Loader/Loader';

interface Review {
  id_review: string;
  id_user: string;
  id_team?: string;
  id_tournament?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  reviews_by_rating: Record<number, number>;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'global' | 'tournament'>('all');

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchQuery, filterRating, filterType]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Review[]>('/reviews');
      setReviews(data);
      setFilteredReviews(data);
    } catch (err) {
      setError('An error occurred while loading reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiService.get<ReviewStats>('/api/reviews/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching review stats:', err);
    }
  };

  const filterReviews = () => {
    let result = [...reviews];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(review =>
        review.comment?.toLowerCase().includes(query) ||
        review.id_user.toLowerCase().includes(query)
      );
    }

    if (filterRating !== null) {
      result = result.filter(review => review.rating === filterRating);
    }

    if (filterType === 'global') {
      result = result.filter(review => !review.id_tournament);
    } else if (filterType === 'tournament') {
      result = result.filter(review => !!review.id_tournament);
    }

    setFilteredReviews(result);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await apiService.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review.id_review !== reviewId));
      setShowDeleteConfirm(null);
      fetchStats();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Reviews</h1>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
            <div className="text-sm text-[var(--text-secondary)]">Total Reviews</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {stats.total_reviews}
            </div>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
            <div className="text-sm text-[var(--text-secondary)]">Average Rating</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1 flex items-center gap-2">
              {stats.average_rating.toFixed(1)}
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
            <div className="text-sm text-[var(--text-secondary)]">5 Stars</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {stats.reviews_by_rating[5] || 0}
            </div>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
            <div className="text-sm text-[var(--text-secondary)]">1 Star</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {stats.reviews_by_rating[1] || 0}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'global' | 'tournament')}
              className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="global">Global Reviews</option>
              <option value="tournament">Tournament Reviews</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No reviews found
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id_review}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(review.created_at)}
                      </span>
                      {review.id_tournament ? (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                          Tournament
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                          Global
                        </span>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-[var(--text-primary)] mb-2">{review.comment}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <span>User ID: {review.id_user.substring(0, 8)}...</span>
                      {review.id_team && (
                        <span>Team ID: {review.id_team.substring(0, 8)}...</span>
                      )}
                      {review.id_tournament && (
                        <span>Tournament ID: {review.id_tournament.substring(0, 8)}...</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {showDeleteConfirm === review.id_review ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(review.id_review)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(review.id_review)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

