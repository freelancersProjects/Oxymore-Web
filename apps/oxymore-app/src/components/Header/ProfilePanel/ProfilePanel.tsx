import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, User, ChevronDown, ChevronUp, KeyRound, ChevronLeft, Settings, Shield, LogOut, Search } from 'lucide-react';
import { OXMModal } from '@oxymore/ui';
// import './ProfilePanel.scss';

export interface FriendItem {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
}

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_FRIENDS: FriendItem[] = [
  { id: 1, name: 'AlexThePro', avatar: '', status: 'online' },
  { id: 2, name: 'CS2Master', avatar: '', status: 'in-game' },
  { id: 3, name: 'SniperQueen', avatar: '', status: 'offline' },
  { id: 4, name: 'RushPlayer', avatar: '', status: 'online' },
  { id: 5, name: 'TacticalGamer', avatar: '', status: 'online' },
  { id: 6, name: 'AWPKing', avatar: '', status: 'in-game' },
  { id: 7, name: 'ClutchMaster', avatar: '', status: 'online' },
  { id: 8, name: 'PeekGod', avatar: '', status: 'offline' },
  { id: 9, name: 'EcoSaver', avatar: '', status: 'online' },
  { id: 10, name: 'UtilityKing', avatar: '', status: 'in-game' },
];

const ANIM_MS = 250;

const ProfilePanel: React.FC<ProfilePanelProps> = ({ open, onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showMoreFriends, setShowMoreFriends] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const totalFriends = MOCK_FRIENDS.length;
  const friendsPreview = useMemo(() => (showMoreFriends ? MOCK_FRIENDS : MOCK_FRIENDS.slice(0, 4)), [showMoreFriends]);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const t = setTimeout(() => setShouldRender(false), ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [open, shouldRender]);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_FRIENDS;
    return MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(q));
  }, [query]);

  if (!shouldRender) return null;

  return (
    <div
      className={"profile-panel" + (open && !isClosing ? " open" : "") + (isClosing ? " closing" : "")}
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label="Profile Panel"
    >
      <button className="profile-panel__close" aria-label="Close" onClick={onClose}>
        <ChevronLeft size={18} />
      </button>

      <div className="profile-panel__section profile-panel__header">
        <div className="profile-panel__avatar">
          <img src="https://i.pravatar.cc/64" alt="You" />
        </div>
        <div className="profile-panel__identity">
          <div className="name">John Doe</div>
          <div className="meta">Level 42 • Master League</div>
        </div>
        <button className="profile-panel__profile-link" type="button" onClick={() => navigate('/profile')}>
          <User size={18} />
          <span>View Profile</span>
        </button>
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
          <div className="section-title with-count">
            <span>Friends</span>
            <span className="count">{totalFriends}</span>
          </div>
          <div className="friends-list">
            {friendsPreview.map((f) => (
              <div key={f.id} className="friend-row">
                <div className="friend-avatar" aria-hidden>
                  <span>{f.avatar}</span>
                </div>
                <div className="friend-info">
                  <div className="friend-name">{f.name}</div>
                  <div className={`friend-status status-${f.status.replace(' ', '-')}`}>{f.status}</div>
                </div>
                <button className="friend-invite-btn" onClick={() => setInviteOpen(true)}>Invite</button>
              </div>
            ))}
          </div>
          {totalFriends > 4 && (
            <button className="see-more" onClick={() => setShowMoreFriends((v) => !v)}>
              {showMoreFriends ? (
                <>
                  <ChevronUp size={16} />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  <span>Show more</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="profile-panel__section profile-panel__quick">
          <button className="quick-item" type="button" onClick={() => navigate('/teams')}>
            <Users size={16} />
            <div>
              <div className="title">My Teams</div>
              <div className="subtitle">Create or manage your teams</div>
            </div>
          </button>
          <button className="quick-item" type="button" onClick={() => navigate('/settings')}>
            <Settings size={16} />
            <div>
              <div className="title">Settings</div>
              <div className="subtitle">Account and preferences</div>
            </div>
          </button>
          <button className="quick-item" type="button" onClick={() => navigate('/api-keys')}>
            <KeyRound size={16} />
            <div>
              <div className="title">API Access</div>
              <div className="subtitle">Manage your API keys and integrations</div>
            </div>
          </button>
          <button className="quick-item" type="button" onClick={() => navigate('/security')}>
            <Shield size={16} />
            <div>
              <div className="title">Security</div>
              <div className="subtitle">Sessions and 2FA</div>
            </div>
          </button>
        </div>

        <div className="profile-panel__section profile-panel__links">
          <button type="button" className="link-item" onClick={() => navigate('/login')}>
            <LogOut size={16} />
            <div className="texts">
              <div className="title">Sign out</div>
              <div className="subtitle">Switch account</div>
            </div>
          </button>
        </div>
      </div>

      <OXMModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)}>
        <div className="invite-modal">
          <div className="invite-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search friends..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="invite-list">
            {filteredFriends.map((f) => (
              <button key={f.id} className="invite-item">
                <span className="avatar">{f.avatar}</span>
                <span className="name">{f.name}</span>
                <span className={`status ${f.status.replace(' ', '-')}`}>{f.status}</span>
                <span className="action">Invite</span>
              </button>
            ))}
          </div>
        </div>
      </OXMModal>
    </div>
  );
};

export default ProfilePanel;
