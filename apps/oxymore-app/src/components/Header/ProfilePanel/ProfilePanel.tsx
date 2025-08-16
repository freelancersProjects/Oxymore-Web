import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, User, ChevronDown, ChevronUp, KeyRound, Settings, Shield, LogOut, Search } from 'lucide-react';
import { OXMModal } from '@oxymore/ui';
import './ProfilePanel.scss';

export interface FriendItem {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
}

interface ProfilePanelProps {
  collapsed: boolean;
}

const MOCK_FRIENDS: FriendItem[] = [
  { id: 1, name: 'AlexThePro', avatar: 'https://i.pravatar.cc/64?u=1', status: 'online' },
  { id: 2, name: 'CS2Master', avatar: 'https://i.pravatar.cc/64?u=2', status: 'in-game' },
  { id: 3, name: 'SniperQueen', avatar: 'https://i.pravatar.cc/64?u=3', status: 'offline' },
  { id: 4, name: 'RushPlayer', avatar: 'https://i.pravatar.cc/64?u=4', status: 'online' },
  { id: 5, name: 'TacticalGamer', avatar: 'https://i.pravatar.cc/64?u=5', status: 'online' },
  { id: 6, name: 'AWPKing', avatar: 'https://i.pravatar.cc/64?u=6', status: 'in-game' },
  { id: 7, name: 'ClutchMaster', avatar: 'https://i.pravatar.cc/64?u=7', status: 'online' },
  { id: 8, name: 'PeekGod', avatar: 'https://i.pravatar.cc/64?u=8', status: 'offline' },
  { id: 9, name: 'EcoSaver', avatar: 'https://i.pravatar.cc/64?u=9', status: 'online' },
  { id: 10, name: 'UtilityKing', avatar: 'https://i.pravatar.cc/64?u=10', status: 'in-game' },
];

// Mock user stats
const USER_STATS = {
  level: 42,
  league: 'Dust League',
  elo: 2345,
  matchesPlayed: 156,
  winRate: 68,
  currentStreak: 5,
  totalFriends: 10,
  onlineFriends: 6,
  inGameFriends: 3
};

const ProfilePanel: React.FC<ProfilePanelProps> = ({ collapsed }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [showMoreFriends, setShowMoreFriends] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const totalFriends = MOCK_FRIENDS.length;
  const friendsPreview = useMemo(() => (showMoreFriends ? MOCK_FRIENDS : MOCK_FRIENDS.slice(0, 4)), [showMoreFriends]);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_FRIENDS;
    return MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div
      className={`profile-panel${collapsed ? ' collapsed' : ''}`}
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label="Profile Panel"
    >
      {collapsed ? (
        <div className="profile-panel__collapsed">
          <div className="profile-panel__avatar-collapsed">
            <img src="https://i.pravatar.cc/64" alt="You" />
            <div className="online-indicator"></div>
            <div className="level-badge">{USER_STATS.level}</div>
          </div>

          <div className="profile-panel__stats-collapsed">
            <div className="stat-item-collapsed">
              <div className="stat-value">{USER_STATS.onlineFriends}</div>
              <div className="stat-label">Online</div>
            </div>
            <div className="stat-item-collapsed">
              <div className="stat-value">{USER_STATS.elo}</div>
              <div className="stat-label">Elo</div>
            </div>
          </div>

          <div className="profile-panel__quick-icons">
            <button className="quick-icon" onClick={() => navigate('/teams')} title="My Teams">
              <Users size={18} />
            </button>
            <button className="quick-icon" onClick={() => navigate('/friends')} title="Friends">
              <User size={18} />
            </button>
            <button className="quick-icon" onClick={() => navigate('/settings')} title="Settings">
              <Settings size={18} />
            </button>
            <button className="quick-icon" onClick={() => navigate('/security')} title="Security">
              <Shield size={18} />
            </button>
            <button className="quick-icon" onClick={() => navigate('/api-keys')} title="API Access">
              <KeyRound size={18} />
            </button>
            <button className="quick-icon signout" onClick={() => navigate('/logout')} title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>

          <div className="profile-panel__online-friends-collapsed">
            <div className="online-friends-header">
              <div className="online-friends-title">Friends Online</div>
            </div>
            <div className="online-friends-avatars">
              {MOCK_FRIENDS.filter(f => f.status === 'online' || f.status === 'in-game').slice(0, 3).map((friend) => (
                <div key={friend.id} className="friend-avatar-collapsed" title={`${friend.name} - ${friend.status === 'in-game' ? 'Playing CS2' : 'Online'}`}>
                  <img src={friend.avatar} alt={friend.name} />
                  <div className={`status-indicator ${friend.status}`} />
                  <div className="friend-name-tooltip">{friend.name}</div>
                </div>
              ))}
              {USER_STATS.onlineFriends > 3 && (
                <div className="more-friends-indicator" title={`+${USER_STATS.onlineFriends - 3} more online`}>
                  <span>+{USER_STATS.onlineFriends - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="profile-panel__section profile-panel__header">
            <div className="profile-panel__avatar">
              <img src="https://i.pravatar.cc/64" alt="You" />
              <div className="online-indicator"></div>
            </div>
            <div className="profile-panel__identity">
              <div className="name">John Doe</div>
              <div className="meta">Level {USER_STATS.level} • {USER_STATS.league}</div>
              <div className="elo-badge">Elo: {USER_STATS.elo}</div>
            </div>
            <button className="profile-panel__profile-link" type="button" onClick={() => navigate('/profile')}>
              <User size={18} />
              <span>View Profile</span>
            </button>
          </div>

          <div className="profile-panel__section profile-panel__stats">
            <div className="section-title">
              <span>Your Stats</span>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{USER_STATS.matchesPlayed}</div>
                <div className="stat-label">Matches</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{USER_STATS.winRate}%</div>
                <div className="stat-label">Win Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{USER_STATS.currentStreak}</div>
                <div className="stat-label">Streak</div>
              </div>
            </div>
          </div>

          <div className="profile-panel__scroll">
            <div className="profile-panel__section profile-panel__group">
              <div className="section-title">
                <Users size={16} />
                <span>Your Group</span>
              </div>
              <div className="group-avatars">
                {[1, 2, 3, 4].map((slot) => (
                  <button key={slot} className="group-avatar empty" aria-label="Invite a friend" onClick={() => setInviteOpen(true)}>
                    <Plus size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-panel__section profile-panel__friends">
              <div className="section-title">
                <Users size={16} />
                <span>Friends ({USER_STATS.totalFriends})</span>
                <div className="friends-summary">
                  <span className="online-count">{USER_STATS.onlineFriends} online</span>
                  <span className="in-game-count">{USER_STATS.inGameFriends} in-game</span>
                </div>
              </div>

              <div className="online-friends-preview">
                <div className="preview-title">Online Friends</div>
                <div className="friends-avatars">
                  {MOCK_FRIENDS.filter(f => f.status === 'online' || f.status === 'in-game').slice(0, 6).map((friend) => (
                    <div key={friend.id} className="friend-avatar-preview" title={friend.name}>
                      <img src={friend.avatar} alt={friend.name} />
                      <div className={`status-indicator ${friend.status}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="friends-list">
                {friendsPreview.map((friend) => (
                  <div key={friend.id} className="friend-item">
                    <div className="friend-avatar">
                      <img src={friend.avatar} alt={friend.name} />
                      <div className={`status-indicator ${friend.status}`} />
                    </div>
                    <div className="friend-info">
                      <div className="friend-name">{friend.name}</div>
                      <div className="friend-status">
                        {friend.status === 'in-game' ? 'Playing CS2' : friend.status}
                      </div>
                    </div>
                    <button className="friend-action">
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {totalFriends > 4 && (
                <button
                  className="show-more-button"
                  onClick={() => setShowMoreFriends(!showMoreFriends)}
                >
                  {showMoreFriends ? (
                    <>
                      <ChevronUp size={16} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Show More ({totalFriends - 4})
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="profile-panel__section profile-panel__quick-actions">
              <div className="section-title">
                <span>Quick Actions</span>
              </div>
              <div className="quick-actions-list">
                <button className="quick-action" onClick={() => navigate('/teams')}>
                  <Users size={16} />
                  <span>My Teams</span>
                </button>
                <button className="quick-action" onClick={() => navigate('/settings')}>
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button className="quick-action" onClick={() => navigate('/security')}>
                  <Shield size={16} />
                  <span>Security</span>
                </button>
              </div>
            </div>

            <div className="profile-panel__section profile-panel__api-access">
              <button className="api-access-button" onClick={() => navigate('/api-keys')}>
                <KeyRound size={16} />
                <span>API Access</span>
              </button>
            </div>

            <div className="profile-panel__section profile-panel__signout">
              <button className="signout-button" onClick={() => navigate('/logout')}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      <OXMModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Friends to Group"
        size="medium"
      >
        <div className="invite-modal-content">
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search friends..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="friends-list-modal">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="friend-item-modal">
                <div className="friend-avatar">
                  <img src={`https://i.pravatar.cc/32?u=${friend.id}`} alt={friend.name} />
                  <div className={`status-indicator ${friend.status}`} />
                </div>
                <div className="friend-info">
                  <div className="friend-name">{friend.name}</div>
                  <div className="friend-status">{friend.status}</div>
                </div>
                <button className="invite-button">
                  <Plus size={16} />
                  Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      </OXMModal>
    </div>
  );
};

export default ProfilePanel;
