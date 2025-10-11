import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Calendar,
  Trophy,
  Wallet,
  Flag,
  MessageSquare,
  Star,
  Link as LinkIcon,
  Twitter,
  Twitch,
  Youtube,
  Lock,
  Users,
  Clock,
  CheckCircle,
  Gamepad2,
  Mail,
  Target,
  TrendingUp,
  Award,
  MessageCircle,
  UserPlus,
  Monitor,
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import Tooltip, { getTooltipMessage } from '../../components/Tooltip/Tooltip';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const UserDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isUpdatingPremium, setIsUpdatingPremium] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [isUpdatingBan, setIsUpdatingBan] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const [currentBan, setCurrentBan] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMute, setCurrentMute] = useState<any>(null);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [isUpdatingMute, setIsUpdatingMute] = useState(false);
  const [muteReason, setMuteReason] = useState('');

  const [userFriends, setUserFriends] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchAdditionalData();
    }
  }, [user]);

  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      const role = await apiService.get<UserRole>(`/roles/${userId}`);
      return role;
    } catch (error) {
      console.error(`Error fetching role for user ${userId}:`, error);
      return null;
    }
  };

  const fetchAdditionalData = async () => {
    if (!user) return;

    try {
      // Simuler des données supplémentaires (en dur pour l'instant)
      const mockFriends = [
        { id: '1', username: 'PlayerOne', avatar: null, status: 'online', mutual_friends: 5 },
        { id: '2', username: 'GamerPro', avatar: null, status: 'in-game', mutual_friends: 3 },
        { id: '3', username: 'EliteGamer', avatar: null, status: 'offline', mutual_friends: 8 },
        { id: '4', username: 'ProPlayer', avatar: null, status: 'online', mutual_friends: 2 }
      ];

      const mockMessages = [
        { id: '1', from: 'PlayerOne', content: 'Salut ! Tu veux jouer ?', timestamp: '2024-01-15T10:30:00Z', unread: true },
        { id: '2', from: 'GamerPro', content: 'GG pour le match !', timestamp: '2024-01-15T09:15:00Z', unread: false },
        { id: '3', from: 'EliteGamer', content: 'On refait une partie ?', timestamp: '2024-01-14T20:45:00Z', unread: false }
      ];

      const mockActivity = [
        { id: '1', type: 'login', description: 'Connexion', timestamp: '2024-01-15T10:30:00Z', icon: Monitor },
        { id: '2', type: 'match', description: 'Match terminé - Victoire', timestamp: '2024-01-15T09:15:00Z', icon: Trophy },
        { id: '3', type: 'message', description: 'Message envoyé', timestamp: '2024-01-15T08:45:00Z', icon: MessageCircle },
        { id: '4', type: 'friend', description: 'Nouvel ami ajouté', timestamp: '2024-01-14T20:30:00Z', icon: UserPlus },
        { id: '5', type: 'tournament', description: 'Inscription tournoi', timestamp: '2024-01-14T18:00:00Z', icon: Award }
      ];

      const mockTeam = {
        id: 'team1',
        name: 'Elite Squad',
        role: 'Captain',
        members_count: 5,
        created_at: '2024-01-01T00:00:00Z'
      };

      const mockStats = {
        total_matches: 156,
        wins: 98,
        losses: 58,
        win_rate: 62.8,
        avg_score: 1.4,
        play_time: '2h 34m',
        favorite_game: 'CS2',
        rank: 'Global Elite'
      };

      setUserFriends(mockFriends);
      setRecentMessages(mockMessages);
      setUserActivity(mockActivity);
      setUserTeam(mockTeam);
      setUserStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement des données supplémentaires:', error);
    } finally {
      setLoadingAdditionalData(false);
    }
  };

  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<User>(`/users/${id}`);
      setUser(data);

      // Récupérer le rôle de l'utilisateur
      const role = await fetchUserRole(id);
      setUserRole(role);

      // Récupérer les sanctions de l'utilisateur
      await fetchUserSanctions(id);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des données utilisateur');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSanctions = async (userId: string) => {
    try {
      const sanctions = await apiService.get<any[]>(`/user-sanctions`);
      const userSanctions = sanctions.filter(sanction => sanction.id_user === userId);

      // Vérifier s'il y a un ban actif
      const activeBan = userSanctions.find(sanction =>
        sanction.type === 'ban' &&
        (!sanction.expires_at || new Date(sanction.expires_at) > new Date())
      );

      if (activeBan) {
        setIsBanned(true);
        setCurrentBan(activeBan);
      } else {
        setIsBanned(false);
        setCurrentBan(null);
      }

      // Vérifier s'il y a un mute actif
      const activeMute = userSanctions.find(sanction =>
        sanction.type === 'mute' &&
        (!sanction.expires_at || new Date(sanction.expires_at) > new Date())
      );

      if (activeMute) {
        setIsMuted(true);
        setCurrentMute(activeMute);
      } else {
        setIsMuted(false);
        setCurrentMute(null);
      }
    } catch (error) {
      console.error('Error fetching user sanctions:', error);
    }
  };

  const formatWallet = (wallet: number | string | undefined | null): string => {
    if (wallet === undefined || wallet === null) return '-';
    const numWallet = typeof wallet === 'string' ? parseFloat(wallet) : wallet;
    return `${numWallet.toFixed(2)} €`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'in-game': return 'text-blue-400';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      case 'in-game': return <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />;
      case 'offline': return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const generateAvatarWithInitial = (username: string) => {
    const initial = username.charAt(0).toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${initial}&backgroundColor=8b5cf6&textColor=ffffff`;
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const isUserAdmin = (): boolean => {
    return userRole?.name === 'admin';
  };

  const canModifyUser = () => {
    if (!currentUser || !user) return false;

    if (currentUser.id === user.id_user) {
      return false;
    }

    if (isUserAdmin()) {
      return false;
    }

    return true;
  };

  const isViewingAdmin = isUserAdmin();

  const handleTogglePremium = async () => {
    if (!user) return;

    try {
      setIsUpdatingPremium(true);
      await apiService.patch(`/users/${user.id_user}/premium`, {
        is_premium: !user.is_premium
      });

      setUser(prev => prev ? { ...prev, is_premium: !prev.is_premium } : null);

      setShowPremiumModal(false);

      try {
        await apiService.post('/users/stats/refresh', {});
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }

    } catch (error) {
      console.error('Error toggling premium status:', error);
    } finally {
      setIsUpdatingPremium(false);
    }
  };

  const handleBanUser = async () => {
    if (!user || !banReason.trim() || !currentUser) return;

    try {
      setIsUpdatingBan(true);

      // Créer une sanction de ban
      await apiService.post('/user-sanctions', {
        reason: banReason,
        type: 'ban',
        id_user: user.id_user,
        id_admin: currentUser.id
      });

      setShowBanModal(false);
      setBanReason('');

      // Rafraîchir les données utilisateur
      await fetchUser();

      try {
        await apiService.post('/users/stats/refresh', {});
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }

    } catch (error) {
      console.error('Error banning user:', error);
    } finally {
      setIsUpdatingBan(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!user || !currentBan || !currentUser) return;

    try {
      setIsUpdatingBan(true);

      // Supprimer la sanction de ban
      await apiService.delete(`/user-sanctions/${currentBan.id_user_sanction}`);

      setShowBanModal(false);

      // Rafraîchir les données utilisateur
      await fetchUser();

      try {
        await apiService.post('/users/stats/refresh', {});
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }

    } catch (error) {
      console.error('Error unbanning user:', error);
    } finally {
      setIsUpdatingBan(false);
    }
  };

  const handleMuteUser = async () => {
    if (!user || !muteReason.trim() || !currentUser) return;

    try {
      setIsUpdatingMute(true);

      // Créer une sanction de mute
      await apiService.post('/user-sanctions', {
        reason: muteReason,
        type: 'mute',
        id_user: user.id_user,
        id_admin: currentUser.id
      });

      setShowMuteModal(false);
      setMuteReason('');

      // Rafraîchir les données utilisateur
      await fetchUser();

      try {
        await apiService.post('/users/stats/refresh', {});
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }

    } catch (error) {
      console.error('Error muting user:', error);
    } finally {
      setIsUpdatingMute(false);
    }
  };

  const handleUnmuteUser = async () => {
    if (!user || !currentMute || !currentUser) return;

    try {
      setIsUpdatingMute(true);

      // Supprimer la sanction de mute
      await apiService.delete(`/user-sanctions/${currentMute.id_user_sanction}`);

      setShowMuteModal(false);

      // Rafraîchir les données utilisateur
      await fetchUser();

      try {
        await apiService.post('/users/stats/refresh', {});
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }

    } catch (error) {
      console.error('Error unmuting user:', error);
    } finally {
      setIsUpdatingMute(false);
    }
  };


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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/users"
            className="p-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            Détails de l'utilisateur
          </h1>
        </div>
        {isViewingAdmin && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Administrateur</span>
          </div>
        )}
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-[var(--overlay-hover)] h-32 md:h-48">
        {user.banner_url ? (
          <img
            src={user.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 ${user.banner_url ? 'hidden' : ''}`} />
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Status indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {getStatusIcon(user.online_status || 'offline')}
          <span className={`text-xs font-medium ${getStatusColor(user.online_status || 'offline')}`}>
            {user.online_status === 'in-game' ? 'En jeu' :
             user.online_status === 'online' ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>

        <div className="absolute -bottom-4 md:-bottom-6 left-4 md:left-8 ring-4 md:ring-8 ring-[var(--background)] rounded-xl md:rounded-2xl overflow-hidden">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-[var(--overlay-hover)]">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = generateAvatarWithInitial(user.username);
                }}
              />
            ) : (
              <img
                src={generateAvatarWithInitial(user.username)}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Verified badge */}
        {user.verified && (
          <div className="absolute -bottom-2 md:-bottom-3 left-20 md:left-28">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-10">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2 break-words hyphens-auto leading-tight">
                  {user.username}
                  {isViewingAdmin && (
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  )}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm md:text-base">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div className="flex gap-2">
                {user.is_premium ? (
                  <div className="px-3 py-1 bg-oxymore-purple text-white text-sm font-medium rounded-lg">
                    Premium
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg">
                    Free
                  </div>
                )}
                {isBanned && (
                  <div className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg">
                    Banni
                  </div>
                )}
                {isMuted && (
                  <div className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-lg">
                    Muté
                  </div>
                )}
              </div>
            </div>
            {user.bio && (
              <p className="text-[var(--text-primary)] text-sm md:text-base break-words hyphens-auto leading-relaxed">{user.bio}</p>
            )}
            {isBanned && currentBan && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Utilisateur banni</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  <strong>Raison :</strong> {currentBan.reason || 'Aucune raison spécifiée'}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  <strong>Banni le :</strong> {new Date(currentBan.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {currentBan.expires_at && (
                  <p className="text-xs text-[var(--text-muted)]">
                    <strong>Expire le :</strong> {new Date(currentBan.expires_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            )}
            {isMuted && currentMute && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">Utilisateur muté</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  <strong>Raison :</strong> {currentMute.reason || 'Aucune raison spécifiée'}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  <strong>Muté le :</strong> {new Date(currentMute.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {currentMute.expires_at && (
                  <p className="text-xs text-[var(--text-muted)]">
                    <strong>Expire le :</strong> {new Date(currentMute.expires_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar className="w-4 h-4" />
                <span>
                  Inscrit le{" "}
                  {new Date(user.created_at || "").toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {user.country_code && (
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Flag className="w-4 h-4" />
                  <span>{user.country_code}</span>
                </div>
              )}
              {user.last_seen && (
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Clock className="w-4 h-4" />
                  <span>
                    Dernière connexion{" "}
                    {formatRelativeTime(user.last_seen)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.discord_link && (
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <MessageCircle className="w-4 h-4" />
                  <span className="truncate">Discord connecté</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Shield className="w-4 h-4" />
                <span>Rôle: {userRole?.name || 'Utilisateur'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              Statistiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[var(--text-secondary)] text-sm">ELO</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                  {user.elo || "-"}
                </p>
              </div>
              {user.wallet !== undefined && (
                <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">Wallet</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                    {formatWallet(user.wallet)}
                  </p>
                </div>
              )}
              <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-[var(--text-secondary)] text-sm">Chat</span>
                </div>
                <p className="text-[var(--text-primary)] text-sm md:text-base">
                  {user.team_chat_is_muted ? "Muté" : "Actif"}
                </p>
              </div>
              <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-[var(--text-secondary)] text-sm">Amis</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                  {userFriends.length}
                </p>
              </div>
            </div>

            {/* Statistiques détaillées si disponibles */}
            {userStats && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">Victoires</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {userStats.wins}/{userStats.total_matches}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {userStats.win_rate}% de réussite
                  </p>
                </div>
                <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">Score moyen</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {userStats.avg_score}
                  </p>
                </div>
                <div className="bg-[var(--overlay-hover)] rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">Jeu favori</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {userStats.favorite_game}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline d'activité */}
          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              Activité récente
            </h3>
            <div className="space-y-4">
              {userActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--overlay-hover)] flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)]">
                        {activity.description}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                    {index < userActivity.length - 1 && (
                      <div className="absolute left-4 top-12 w-px h-4 bg-[var(--border-color)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              Liens
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Star className="w-5 h-5" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">Faceit</span>
                  {user.faceit_id ? (
                    <a
                      href={user.faceit_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors text-sm truncate block"
                    >
                      {user.faceit_id.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="ml-2 text-sm">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <LinkIcon className="w-5 h-5" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">Steam</span>
                  {user.steam_link ? (
                    <a
                      href={user.steam_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors text-sm truncate block"
                    >
                      {user.steam_link.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="ml-2 text-sm">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Twitter className="w-5 h-5 text-blue-400" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">Twitter</span>
                  {(user as any).twitter_url ? (
                    <a
                      href={(user as any).twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors text-sm truncate block"
                    >
                      {(user as any).twitter_url.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="ml-2 text-sm">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Twitch className="w-5 h-5 text-purple-500" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">Twitch</span>
                  {user.twitch_link ? (
                    <a
                      href={user.twitch_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors text-sm truncate block"
                    >
                      {user.twitch_link.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="ml-2 text-sm">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Youtube className="w-5 h-5 text-red-500" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">YouTube</span>
                  {user.youtube_link ? (
                    <a
                      href={user.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors text-sm truncate block"
                    >
                      {user.youtube_link.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="ml-2 text-sm">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <MessageCircle className="w-5 h-5 text-indigo-500" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">Discord</span>
                  {user.discord_link ? (
                    <a
                      href={user.discord_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:text-[var(--text-primary)] transition-colors text-sm truncate block"
                    >
                      {user.discord_link.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <span className="ml-2 text-sm">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Amis */}
          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Amis
              </h3>
              <span className="text-sm text-[var(--text-muted)]">
                {userFriends.length} ami{userFriends.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {userFriends.slice(0, 4).map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{
                    backgroundImage: `url(${friend.avatar || generateAvatarWithInitial(friend.username)})`
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {friend.username}
                      </p>
                      {getStatusIcon(friend.status)}
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {friend.mutual_friends} ami{friend.mutual_friends > 1 ? 's' : ''} en commun
                    </p>
                  </div>
                </div>
              ))}
              {userFriends.length > 4 && (
                <div className="text-center">
                  <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Voir tous les amis ({userFriends.length - 4} de plus)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section Messages récents */}
          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Messages récents
              </h3>
              <span className="text-sm text-[var(--text-muted)]">
                {recentMessages.filter(m => m.unread).length} non lu{recentMessages.filter(m => m.unread).length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {recentMessages.slice(0, 3).map((message) => (
                <div key={message.id} className={`p-3 rounded-lg transition-colors ${message.unread ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-[var(--overlay-hover)]'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cover bg-center flex-shrink-0" style={{
                      backgroundImage: `url(${generateAvatarWithInitial(message.from)})`
                    }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {message.from}
                        </p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {message.content}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {formatRelativeTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Équipe */}
          {userTeam && (
            <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                Équipe actuelle
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--overlay-hover)]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {userTeam.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {userTeam.role} • {userTeam.members_count} membre{userTeam.members_count > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">
                    Depuis {new Date(userTeam.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[var(--card-background)] rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Actions
              </h3>
              {!canModifyUser() && (
                <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs md:text-sm">
                  <Lock className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Lecture seule</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Tooltip
                content={getTooltipMessage(
                  canModifyUser(),
                  currentUser?.id === user?.id_user,
                  isUserAdmin(),
                  isBanned ? "Débannir" : "Bannir"
                )}
                disabled={canModifyUser()}
              >
                <button
                  onClick={() => setShowBanModal(true)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                    canModifyUser()
                      ? isBanned
                        ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                      : "bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed"
                  }`}
                  disabled={!canModifyUser()}
                >
                  {isBanned ? "Débannir l'utilisateur" : "Bannir l'utilisateur"}
                </button>
              </Tooltip>

              <Tooltip
                content={getTooltipMessage(
                  canModifyUser(),
                  currentUser?.id === user?.id_user,
                  isUserAdmin(),
                  isMuted ? "Démuter" : "Muter"
                )}
                disabled={canModifyUser()}
              >
                <button
                  onClick={() => setShowMuteModal(true)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                    canModifyUser()
                      ? isMuted
                        ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        : "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
                      : "bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed"
                  }`}
                  disabled={!canModifyUser()}
                >
                  {isMuted ? "Démuter l'utilisateur" : "Muter l'utilisateur"}
                </button>
              </Tooltip>

              <Tooltip
                content={getTooltipMessage(
                  canModifyUser(),
                  currentUser?.id === user?.id_user,
                  isUserAdmin(),
                  user.is_premium ? "Retirer Premium" : "Donner Premium"
                )}
                disabled={canModifyUser()}
              >
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                    canModifyUser()
                      ? "bg-[var(--overlay-hover)] text-[var(--text-primary)] hover:bg-[var(--overlay-active)]"
                      : "bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed"
                  }`}
                  disabled={!canModifyUser()}
                >
                  {user.is_premium ? "Retirer Premium" : "Donner Premium"}
                </button>
              </Tooltip>

            </div>
            {!canModifyUser() && (
              <p className="text-xs text-[var(--text-muted)] mt-3">
                {isViewingAdmin
                  ? "Les actions sont désactivées pour les comptes administrateur"
                  : "Vous n'avez pas les permissions pour modifier cet utilisateur"}
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onConfirm={handleTogglePremium}
        title={user?.is_premium ? "Retirer Premium" : "Donner Premium"}
        message={
          user?.is_premium
            ? `Êtes-vous sûr de vouloir retirer le statut premium de ${user?.username} ? Cette action supprimera tous les avantages premium.`
            : `Êtes-vous sûr de vouloir donner le statut premium à ${user?.username} ? Cette action donnera accès à tous les avantages premium.`
        }
        confirmText={user?.is_premium ? "Retirer Premium" : "Donner Premium"}
        cancelText="Annuler"
        type="warning"
        isLoading={isUpdatingPremium}
      />

      <ConfirmationModal
        isOpen={showBanModal}
        onClose={() => {
          setShowBanModal(false);
          setBanReason('');
        }}
        onConfirm={isBanned ? handleUnbanUser : handleBanUser}
        title={isBanned ? "Débannir l'utilisateur" : "Bannir l'utilisateur"}
        message={
          isBanned
            ? `Êtes-vous sûr de vouloir débannir ${user?.username} ? Cette action supprimera la sanction de ban.`
            : `Êtes-vous sûr de vouloir bannir ${user?.username} ? Cette action créera une sanction permanente.`
        }
        confirmText={isBanned ? "Débannir" : "Bannir"}
        cancelText="Annuler"
        type={isBanned ? "warning" : "danger"}
        isLoading={isUpdatingBan}
        customContent={
          !isBanned && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Raison du ban (requis)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Expliquez la raison du ban..."
                className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--background-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple focus:border-transparent"
                rows={3}
                required
              />
            </div>
          )
        }
        disabled={!isBanned && !banReason.trim()}
      />

      <ConfirmationModal
        isOpen={showMuteModal}
        onClose={() => {
          setShowMuteModal(false);
          setMuteReason('');
        }}
        onConfirm={isMuted ? handleUnmuteUser : handleMuteUser}
        title={isMuted ? "Démuter l'utilisateur" : "Muter l'utilisateur"}
        message={
          isMuted
            ? `Êtes-vous sûr de vouloir démuter ${user?.username} ? Cette action supprimera la sanction de mute.`
            : `Êtes-vous sûr de vouloir muter ${user?.username} ? Cette action créera une sanction de mute.`
        }
        confirmText={isMuted ? "Démuter" : "Muter"}
        cancelText="Annuler"
        type={isMuted ? "warning" : "info"}
        isLoading={isUpdatingMute}
        customContent={
          !isMuted && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Raison du mute (requis)
              </label>
              <textarea
                value={muteReason}
                onChange={(e) => setMuteReason(e.target.value)}
                placeholder="Expliquez la raison du mute..."
                className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--background-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple focus:border-transparent"
                rows={3}
                required
              />
            </div>
          )
        }
        disabled={!isMuted && !muteReason.trim()}
      />

    </div>
  );
};

export default UserDetails;
