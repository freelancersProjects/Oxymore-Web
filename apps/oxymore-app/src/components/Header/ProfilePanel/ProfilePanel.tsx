import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  User,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Settings,
  Shield,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { OXMModal } from "@oxymore/ui";
import { useAuth } from "../../../context/AuthContext";
import apiService from "../../../api/apiService";
import type { FriendWithUser } from "../../../types/friend";
import "./ProfilePanel.scss";

export interface FriendItem {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "in-game";
}

interface ProfilePanelProps {
  collapsed: boolean;
  onToggle: () => void;
  onNotificationClick?: () => void;
  unreadCount?: number;
}

const USER_STATS = {
  level: 42,
  elo: 1850,
  matches: 156,
  winRate: 68,
  streak: 5,
  totalFriends: 24,
  onlineFriends: 8,
  inGameFriends: 3,
};

// Couleurs pour les avatars avec initiales
const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

// Fonction pour générer un avatar avec initiale
const generateAvatarWithInitial = (username: string, size: number = 48) => {
  const initial = username.charAt(0).toUpperCase();
  const colorIndex = username.charCodeAt(0) % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];

  return (
    <div
      className="avatar-with-initial"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      {initial}
    </div>
  );
};

// Composant Avatar réutilisable
const Avatar: React.FC<{
  src?: string;
  username: string;
  size?: number;
  className?: string;
}> = ({ src, username, size = 48, className = "" }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={className}
        style={{ width: size, height: size, borderRadius: '50%' }}
      />
    );
  }

  return generateAvatarWithInitial(username, size);
};

const ProfilePanel: React.FC<ProfilePanelProps> = ({ collapsed, onToggle, onNotificationClick, unreadCount = 0 }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState<FriendWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMoreFriends, setShowMoreFriends] = useState(false);
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id_user) {
      loadFriends();
      loadUserGroup();
    }
  }, [user]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(`/friends/user/${user?.id_user}`);
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserGroup = async () => {
    try {
      const groups = await apiService.get(`/groups/owned/${user?.id_user}`);
      if (groups && groups.length > 0) {
        setUserGroup(groups[0].id_group);
        await loadGroupMembers(groups[0].id_group);
      } else {
        const newGroup = await apiService.post(
          `/groups/create-default/${user?.id_user}`
        );
        setUserGroup(newGroup.id_group);
        await loadGroupMembers(newGroup.id_group);
      }
    } catch (error) {
      console.error("Error loading user group:", error);
      try {
        const newGroup = await apiService.post(
          `/groups/create-default/${user?.id_user}`
        );
        setUserGroup(newGroup.id_group);
        await loadGroupMembers(newGroup.id_group);
      } catch (createError) {
        console.error("Error creating default group:", createError);
      }
    }
  };

  const loadGroupMembers = async (groupId: string) => {
    try {
      const members = await apiService.get(`/group-members/group/${groupId}`);
      setGroupMembers(members);
    } catch (error) {
      console.error("Error loading group members:", error);
    }
  };

  const handleInviteToGroup = async (friendId: string) => {
    if (!user?.id_user || !userGroup) return;

    try {
      setLoading(true);

      await apiService.post(`/group-members/${userGroup}/invite/${friendId}`, {
        role: "member",
      });

      await loadGroupMembers(userGroup);
    } catch (error) {
      console.error("Error inviting friend to group:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalFriends = friends.length;
  const onlineFriends = friends.filter(
    (friend) =>
      friend.online_status === "online" || friend.online_status === "in-game"
  );
  const friendsPreview = useMemo(
    () => (showMoreFriends ? friends : friends.slice(0, 4)),
    [showMoreFriends, friends]
  );

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) =>
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
  }, [friends, query]);

  // const toggleProfile = () => {
  //   // This will be handled by the parent component
  // };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (collapsed) {
    return (
      <div className="profile-panel collapsed" ref={panelRef}>
        <button className="profile-panel-toggle" onClick={onToggle}>
          <ChevronLeft size={16} />
        </button>
        <div className="profile-panel__collapsed">
          <div className="profile-panel__avatar-collapsed">
            <Avatar
              src={user?.avatar_url}
              username={user?.username || "User"}
              size={48}
            />
            <div className="online-indicator" />
            <div className="level-badge">{USER_STATS.level}</div>
          </div>

          <div className="profile-panel__stats-collapsed">
            <div className="stat-item-collapsed">
              <div className="stat-value">{onlineFriends.length}</div>
              <div className="stat-label">Online</div>
            </div>
            <div className="stat-item-collapsed">
              <div className="stat-value">{user?.elo ?? 0}</div>
              <div className="stat-label">ELO</div>
            </div>
          </div>

          <div className="profile-panel__quick-icons">
            <button className="quick-icon" title="Settings">
              <Settings size={16} />
            </button>
            <button className="quick-icon" title="API Access">
              <KeyRound size={16} />
            </button>
            <button className="quick-icon" title="Security">
              <Shield size={16} />
            </button>
            <button
              className="quick-icon signout"
              title="Sign Out"
              onClick={handleLogout}
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Section Groupe */}
          <div className="profile-panel__group-collapsed">
            <div className="group-header">
              <div className="group-title">Group</div>
            </div>
            <div className="group-avatars-collapsed">
              {/* L'utilisateur actuel (leader avec couronne) */}
              <div
                className="group-avatar-collapsed leader"
                title={`${user?.username || "You"} (Leader)`}
              >
                <Avatar
                  src={user?.avatar_url}
                  username={user?.username || "User"}
                  size={28}
                />
                <div className="crown-icon">👑</div>
              </div>
              {/* Membres du groupe acceptés */}
              {groupMembers
                .filter(
                  (member) =>
                    member.status === "accepted" &&
                    member.id_user !== user?.id_user
                )
                .slice(0, 4)
                .map((member) => (
                  <div
                    key={member.id_group_member}
                    className="group-avatar-collapsed member"
                    title={member.username || "Member"}
                  >
                    <Avatar
                      src={member.avatar_url}
                      username={member.username || "Member"}
                      size={28}
                    />
                  </div>
                ))}
              {Array.from(
                {
                  length: Math.max(
                    0,
                    5 -
                      (1 + groupMembers.filter(
                        (m) =>
                          m.status === "accepted" &&
                          m.id_user !== user?.id_user
                      ).slice(0, 4).length)
                  ),
                },
                (_, index) => (
                  <button
                    key={`empty-${index}`}
                    className="group-avatar-collapsed empty"
                    aria-label="Invite a friend"
                    onClick={() => setInviteOpen(true)}
                    title="Inviter un ami"
                  >
                    <Plus size={14} />
                  </button>
                )
              )}
            </div>
          </div>

          <div className="profile-panel__online-friends-collapsed">
            <div className="online-friends-header">
              <div className="online-friends-title">Friends</div>
            </div>
            <div className="friends-count-circle">
              <span>+{totalFriends}</span>
            </div>
          </div>
          </div>
        </div>
    );
  }

  return (
    <div className="profile-panel" ref={panelRef}>
      {/* Flèche de toggle intégrée au profile panel */}
      <button
        className="profile-panel-toggle"
        onClick={onToggle}
      >
        <ChevronRight size={16} />
      </button>

      {!collapsed && (
        <>
          <div className="profile-panel__header">
            <div className="profile-panel__avatar">
              <Avatar
                src={user?.avatar_url}
                username={user?.username || "User"}
                size={48}
              />
              <div className="online-indicator" />
            </div>
            <div className="profile-panel__identity">
              <div className="name">{user?.username ?? "User"}</div>
              <div className="meta">Level {USER_STATS.level} • Premium</div>
              <div className="elo-badge">ELO {user?.elo || USER_STATS.elo}</div>
            </div>
            <button
              className="profile-panel__profile-link"
              onClick={() => navigate("/profile")}
            >
              <User size={14} />
              <span>Profile</span>
            </button>
          </div>

          <div className="profile-panel__stats">
            <div className="section-title">Stats</div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{USER_STATS.matches}</div>
                <div className="stat-label">Matches</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{USER_STATS.winRate}%</div>
                <div className="stat-label">Win Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{USER_STATS.streak}</div>
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
                {/* L'utilisateur actuel (leader avec couronne) */}
                <div
                  className="group-avatar leader"
                  title={`${user?.username || "You"} (Leader)`}
                >
                  <Avatar
                    src={user?.avatar_url}
                    username={user?.username || "User"}
                    size={32}
                  />
                  <div className="crown-icon">👑</div>
                </div>

                {/* Membres du groupe acceptés */}
                {groupMembers
                  .filter(
                    (member) =>
                      member.status === "accepted" &&
                      member.id_user !== user?.id_user
                  )
                  .slice(0, 4) // max 4 membres pour avoir 5 slots au total
                  .map((member) => (
                    <div
                      key={member.id_group_member}
                      className="group-avatar member"
                      title={member.username || "Member"}
                    >
                      <Avatar
                        src={member.avatar_url}
                        username={member.username || "Member"}
                        size={32}
                      />
                    </div>
                  ))}

                {/* Boutons + pour compléter à 5 slots */}
                {Array.from(
                  {
                    length: Math.max(
                      0,
                      5 -
                        (1 + groupMembers.filter(
                          (m) =>
                            m.status === "accepted" &&
                            m.id_user !== user?.id_user
                        ).slice(0, 4).length)
                    ),
                  },
                  (_, index) => (
                    <button
                      key={`empty-${index}`}
                      className="group-avatar empty"
                      aria-label="Invite a friend"
                      onClick={() => setInviteOpen(true)}
                    >
                      <Plus size={16} />
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="profile-panel__section profile-panel__friends">
              <div className="section-title">
                <Users size={16} />
                <span>Friends ({totalFriends})</span>
                <div className="friends-summary">
                  <span className="online-count">
                    {onlineFriends.length} online
                  </span>
                  <span className="in-game-count">
                    {
                      friends.filter((f) => f.online_status === "in-game")
                        .length
                    }{" "}
                    in-game
                  </span>
                </div>
              </div>

              <div className="online-friends-preview">
                <div className="preview-title">Online Friends</div>
                <div className="friends-avatars">
                  {onlineFriends.slice(0, 4).map((friend) => (
                    <div key={friend.id_friend} className="friend-avatar-preview" title={friend.username}>
                      <Avatar src={friend.avatar_url} username={friend.username} size={36} />
                      <div className={`status-indicator ${friend.online_status || "offline"}`} />
                    </div>
                  ))}
                  {onlineFriends.length > 4 && (
                    <div className="more-friends-indicator">
                      <span>+{onlineFriends.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="friends-list">
                {friendsPreview.map((friend) => (
                  <div key={friend.id_friend} className="friend-item">
                    <div className="friend-avatar">
                      <Avatar
                        src={friend.avatar_url}
                        username={friend.username}
                        size={32}
                      />
                      <div
                        className={`status-indicator ${
                          friend.online_status || "offline"
                        }`}
                      />
                    </div>
                    <div className="friend-info">
                      <div className="friend-name">{friend.username}</div>
                      <div className="friend-status">
                        {friend.online_status || "offline"}
                      </div>
                    </div>
                    <button className="friend-action">
                      <User size={12} />
                    </button>
                  </div>
                ))}
                {totalFriends > 4 && (
                  <button
                    className="show-more-button"
                    onClick={() => setShowMoreFriends(!showMoreFriends)}
                  >
                    {showMoreFriends ? (
                      <>
                        <ChevronUp size={12} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={12} />
                        Show More ({totalFriends - 4})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="profile-panel__section profile-panel__quick-actions">
              <div className="section-title">Quick Actions</div>
              <div className="quick-actions-list">
                {onNotificationClick && (
                  <button
                    className="quick-action notification-action"
                    onClick={onNotificationClick}
                  >
                    <Bell size={14} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>
                )}
                <button
                  className="quick-action"
                  onClick={() => navigate("/settings")}
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <button
                  className="quick-action"
                  onClick={() => navigate("/api-keys")}
                >
                  <KeyRound size={14} />
                  <span>API Access</span>
                </button>
                <button
                  className="quick-action"
                  onClick={() => navigate("/security")}
                >
                  <Shield size={14} />
                  <span>Security</span>
                </button>
              </div>
            </div>
            <div className="profile-panel__section profile-panel__signout">
              <button className="signout-button" onClick={handleLogout}>
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      <OXMModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
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
              <div key={friend.id_friend} className="friend-item-modal">
                <div className="friend-avatar">
                  <Avatar
                    src={friend.avatar_url}
                    username={friend.username}
                    size={32}
                  />
                  <div
                    className={`status-indicator ${
                      friend.online_status || "offline"
                    }`}
                  />
                </div>
                <div className="friend-info">
                  <div className="friend-name">{friend.username}</div>
                  <div className="friend-status">
                    {friend.online_status || "offline"}
                  </div>
                </div>
                <button
                  className="invite-button"
                  onClick={() => handleInviteToGroup(friend.user_id)}
                  disabled={loading}
                >
                  <Plus size={16} />
                  {loading ? "Inviting..." : "Invite"}
                </button>
              </div>
            ))}
            {filteredFriends.length === 0 && (
              <div className="no-friends-message">
                <p>No friends found matching "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </OXMModal>
    </div>
  );
};

export default ProfilePanel;
