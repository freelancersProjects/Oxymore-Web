import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Ban, 
  Edit, 
  Calendar,
  Trophy,
  Wallet,
  MessageCircle,
  ExternalLink,
  Crown,
  User as UserIcon,
  Flag,
  MessageSquare,
  Star,
  Link as LinkIcon,
  Twitter,
  Twitch,
  Youtube,
  Lock
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { User } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import Tooltip, { getTooltipMessage } from '../../components/Tooltip/Tooltip';

const UserDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<User>(`/users/${id}`);
      setUser(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des données utilisateur');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatWallet = (wallet: number | string | undefined): string => {
    if (wallet === undefined || wallet === null) return '-';
    const numWallet = typeof wallet === 'string' ? parseFloat(wallet) : wallet;
    return `${numWallet.toFixed(2)} €`;
  };

  // Vérifier si l'utilisateur connecté peut modifier l'utilisateur consulté
  const canModifyUser = () => {
    if (!currentUser || !user) return false;
    
    // Si c'est le même utilisateur (mon propre compte), pas de modification
    if (currentUser.id === user.id_user) {
      return false;
    }
    
    // Si l'utilisateur consulté est admin, pas de modification (protection des admins)
    if (user.role === 'admin') {
      return false;
    }
    
    return true;
  };

  const isViewingAdmin = user?.role === 'admin';

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-red-500 text-xl mb-4">{error || "Utilisateur non trouvé"}</div>
        <Link
          to="/users"
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/users"
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Détails de l'utilisateur</h1>
        </div>
        {isViewingAdmin && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Administrateur</span>
          </div>
        )}
      </div>

      {/* Banner & Avatar */}
      <div className="relative rounded-2xl overflow-hidden bg-[var(--overlay-hover)] h-48">
        {user.banner_url ? (
          <img 
            src={user.banner_url} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-oxymore opacity-20" />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute -bottom-6 left-8 ring-8 ring-[var(--background)] rounded-2xl overflow-hidden">
          <div className="w-24 h-24 bg-[var(--overlay-hover)]">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-[var(--text-secondary)]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6 pt-10">
        {/* Colonne principale */}
        <div className="col-span-2 space-y-6">
          {/* Informations de base */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  {user.username}
                  {isViewingAdmin && <Shield className="w-5 h-5 text-purple-400" />}
                </h2>
                <p className="text-[var(--text-secondary)]">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              {user.is_premium && (
                <div className="px-3 py-1 bg-gradient-oxymore text-white text-sm font-medium rounded-lg">
                  Premium
                </div>
              )}
            </div>
            {user.bio && (
              <p className="text-[var(--text-primary)]">{user.bio}</p>
            )}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar className="w-4 h-4" />
                <span>Inscrit le {new Date(user.created_at || '').toLocaleDateString()}</span>
              </div>
              {user.country_code && (
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Flag className="w-4 h-4" />
                  <span>{user.country_code}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Statistiques</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--overlay-hover)] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[var(--text-secondary)]">ELO</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{user.elo || '-'}</p>
              </div>
              {user.wallet !== undefined && (
                <div className="bg-[var(--overlay-hover)] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[var(--text-secondary)]">Wallet</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {formatWallet(user.wallet)}
                  </p>
                </div>
              )}
              <div className="bg-[var(--overlay-hover)] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-[var(--text-secondary)]">Chat</span>
                </div>
                <p className="text-[var(--text-primary)]">
                  {user.team_chat_is_muted ? 'Muté' : 'Actif'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Liens */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Liens</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Star className="w-5 h-5" />
                <div>
                  <span>Faceit</span>
                  {user.faceit_url ? (
                    <a 
                      href={user.faceit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors"
                    >
                      {user.faceit_url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span className="ml-2">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <LinkIcon className="w-5 h-5" />
                <div>
                  <span>Steam</span>
                  {user.steam_url ? (
                    <a 
                      href={user.steam_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors"
                    >
                      {user.steam_url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span className="ml-2">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Twitter className="w-5 h-5 text-blue-400" />
                <div>
                  <span>Twitter</span>
                  {user.twitter_url ? (
                    <a 
                      href={user.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors"
                    >
                      {user.twitter_url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span className="ml-2">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Twitch className="w-5 h-5 text-purple-500" />
                <div>
                  <span>Twitch</span>
                  {user.twitch_url ? (
                    <a 
                      href={user.twitch_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors"
                    >
                      {user.twitch_url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span className="ml-2">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Youtube className="w-5 h-5 text-red-500" />
                <div>
                  <span>YouTube</span>
                  {user.youtube_url ? (
                    <a 
                      href={user.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors"
                    >
                      {user.youtube_url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span className="ml-2">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Actions</h3>
              {!canModifyUser() && (
                <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Lecture seule</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Tooltip 
                content={getTooltipMessage(
                  canModifyUser(),
                  currentUser?.id === user?.id_user,
                  user?.role === 'admin',
                  'Bannir'
                )}
                disabled={canModifyUser()}
              >
                <button 
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    canModifyUser() 
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                      : 'bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                  disabled={!canModifyUser()}
                >
                  Bannir l'utilisateur
                </button>
              </Tooltip>
              
              <Tooltip 
                content={getTooltipMessage(
                  canModifyUser(),
                  currentUser?.id === user?.id_user,
                  user?.role === 'admin',
                  user.team_chat_is_muted ? 'Démuter' : 'Muter'
                )}
                disabled={canModifyUser()}
              >
                <button 
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    canModifyUser() 
                      ? 'bg-[var(--overlay-hover)] text-[var(--text-primary)] hover:bg-[var(--overlay-active)]' 
                      : 'bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                  disabled={!canModifyUser()}
                >
                  {user.team_chat_is_muted ? 'Démuter le chat' : 'Muter le chat'}
                </button>
              </Tooltip>
              
              <Tooltip 
                content={getTooltipMessage(
                  canModifyUser(),
                  currentUser?.id === user?.id_user,
                  user?.role === 'admin',
                  user.is_premium ? 'Retirer Premium' : 'Donner Premium'
                )}
                disabled={canModifyUser()}
              >
                <button 
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    canModifyUser() 
                      ? 'bg-[var(--overlay-hover)] text-[var(--text-primary)] hover:bg-[var(--overlay-active)]' 
                      : 'bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                  disabled={!canModifyUser()}
                >
                  {user.is_premium ? 'Retirer Premium' : 'Donner Premium'}
                </button>
              </Tooltip>
            </div>
            {!canModifyUser() && (
              <p className="text-xs text-[var(--text-muted)] mt-3">
                {isViewingAdmin 
                  ? "Les actions sont désactivées pour les comptes administrateur" 
                  : "Vous n'avez pas les permissions pour modifier cet utilisateur"
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 