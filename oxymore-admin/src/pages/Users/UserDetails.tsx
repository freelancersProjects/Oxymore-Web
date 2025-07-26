import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Wallet, 
  Flag, 
  MessageSquare,
  User as UserIcon,
  Calendar,
  Star,
  Shield,
  Link as LinkIcon,
  Youtube,
  Twitch,
//   Steam,
  Globe
} from 'lucide-react';

// Mock data (à remplacer par des vrais appels API)
const mockUser = {
  id_user: "123",
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  email: "john@example.com",
  is_premium: true,
  avatar_url: "https://example.com/avatar.jpg",
  banner_url: "https://example.com/banner.jpg",
  bio: "CS2 Player",
  elo: 1500,
  wallet: 100.00,
  country_code: "FR",
  discord_link: "discord.gg/user",
  faceit_id: "faceit123",
  steam_link: "steamcommunity.com/id/user",
  twitch_link: "twitch.tv/user",
  youtube_link: "youtube.com/@user",
  verified: true,
  created_at: "2023-01-01T00:00:00Z",
  team_chat_is_muted: false
};

const UserDetails = () => {
  const { id } = useParams();
  // TODO: Remplacer par un appel API
  const user = mockUser;

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
        <div className="absolute -bottom-12 left-8 ring-8 ring-[var(--background)] rounded-2xl overflow-hidden">
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
      <div className="grid grid-cols-3 gap-6 pt-16">
        {/* Colonne principale */}
        <div className="col-span-2 space-y-6">
          {/* Informations de base */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  {user.username}
                  {user.verified && (
                    <Shield className="w-5 h-5 text-blue-500" />
                  )}
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
                <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
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
                <p className="text-2xl font-bold text-[var(--text-primary)]">{user.elo}</p>
              </div>
              {user.wallet !== null && (
                <div className="bg-[var(--overlay-hover)] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[var(--text-secondary)]">Wallet</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{user.wallet.toFixed(2)} €</p>
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
              {user.faceit_id && (
                <a 
                  href={`https://faceit.com/players/${user.faceit_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>Faceit</span>
                  <LinkIcon className="w-4 h-4 ml-auto" />
                </a>
              )}
              {user.steam_link && (
                <a 
                  href={`https://${user.steam_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>Steam</span>
                  <LinkIcon className="w-4 h-4 ml-auto" />
                </a>
              )}
              {user.discord_link && (
                <a 
                  href={`https://${user.discord_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Discord</span>
                  <LinkIcon className="w-4 h-4 ml-auto" />
                </a>
              )}
              {user.twitch_link && (
                <a 
                  href={`https://${user.twitch_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Twitch className="w-5 h-5" />
                  <span>Twitch</span>
                  <LinkIcon className="w-4 h-4 ml-auto" />
                </a>
              )}
              {user.youtube_link && (
                <a 
                  href={`https://${user.youtube_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  <span>YouTube</span>
                  <LinkIcon className="w-4 h-4 ml-auto" />
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors">
                Bannir l'utilisateur
              </button>
              <button className="w-full px-4 py-2 bg-[var(--overlay-hover)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--overlay-active)] transition-colors">
                {user.team_chat_is_muted ? 'Démuter le chat' : 'Muter le chat'}
              </button>
              <button className="w-full px-4 py-2 bg-[var(--overlay-hover)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--overlay-active)] transition-colors">
                {user.is_premium ? 'Retirer Premium' : 'Donner Premium'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 