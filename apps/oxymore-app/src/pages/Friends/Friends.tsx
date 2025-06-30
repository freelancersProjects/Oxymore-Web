import React, { useState, useRef } from "react";
import { OXMButton, OXMTabSwitcher, OXMGlowOrb } from "@oxymore/ui";
import {
  Person as PersonIcon,
  Message as MessageIcon,
  SportsEsports as GameIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import FavoriteIcon from "../../assets/svg/favorite.svg?react";
import FriendsStatTooltip from "./FriendsStatTooltip/FriendsStatTooltip";
import "./Friends.scss";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  level: number;
  league: string;
  leagueColor: string;
  status: "online" | "offline" | "in-game";
  lastSeen?: string;
  isFavorite: boolean;
}

const Friends = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [favoriteAnim, setFavoriteAnim] = useState<{[id:number]: boolean}>({});
  const [statTooltip, setStatTooltip] = useState<string | null>(null);
  const onlineRef = useRef<HTMLDivElement | null>(null);
  const ingameRef = useRef<HTMLDivElement | null>(null);
  const favRef = useRef<HTMLDivElement | null>(null);

  const friends: Friend[] = [
    {
      id: 1,
      name: "AlexThePro",
      avatar: "👾",
      level: 42,
      league: "Diamond",
      leagueColor: "#B9F2FF",
      status: "online",
      isFavorite: true,
    },
    {
      id: 2,
      name: "CS2Master",
      avatar: "🎯",
      level: 38,
      league: "Platinum",
      leagueColor: "#E5E4E2",
      status: "in-game",
      isFavorite: false,
    },
    {
      id: 3,
      name: "TacticalGamer",
      avatar: "⚡",
      level: 51,
      league: "Master",
      leagueColor: "#FFD700",
      status: "online",
      isFavorite: true,
    },
    {
      id: 4,
      name: "SniperQueen",
      avatar: "🎮",
      level: 29,
      league: "Gold",
      leagueColor: "#FFD700",
      status: "offline",
      lastSeen: "2h ago",
      isFavorite: false,
    },
    {
      id: 5,
      name: "RushPlayer",
      avatar: "🏃",
      level: 35,
      league: "Silver",
      leagueColor: "#C0C0C0",
      status: "online",
      isFavorite: false,
    },
    {
      id: 6,
      name: "AWPKing",
      avatar: "👑",
      level: 47,
      league: "Diamond",
      leagueColor: "#B9F2FF",
      status: "in-game",
      isFavorite: true,
    },
  ];

  const tabs = [
    { value: "all", label: "All Friends" },
    { value: "online", label: "Online" },
    { value: "favorites", label: "Favorites" },
  ];

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "online") {
      return matchesSearch && friend.status === "online";
    } else if (activeTab === "favorites") {
      return matchesSearch && friend.isFavorite;
    }

    return matchesSearch;
  });

  const handleMessage = (friendId: number) => {
    console.log(`Open messages with friend ${friendId}`);
  };

  const handleFavoriteClick = (friendId: number) => {
    setFavoriteAnim((prev) => ({ ...prev, [friendId]: true }));
    setTimeout(() => {
      setFavoriteAnim((prev) => ({ ...prev, [friendId]: false }));
    }, 350);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#10B981";
      case "in-game":
        return "#F59E0B";
      case "offline":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "in-game":
        return "In Game";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="friends-container">
      <OXMGlowOrb top="10%" left="5%" size="300px" color="#500CAD" />
      <OXMGlowOrb top="60%" right="10%" size="250px" color="#1593CE" />

      <div className="friends-header">
        <div className="header-content">
          <h1 className="friends-title white">Friends</h1>
          <p className="friends-subtitle">Connect with your gaming squad</p>
        </div>

        <div className="header-actions">
          <OXMButton variant="primary" size="medium">
            <AddIcon />
            Add Friend
          </OXMButton>
        </div>
      </div>

      <div className="friends-tabs-search">
        {!showSearch ? (
          <>
            <OXMTabSwitcher
              tabs={tabs}
              value={activeTab}
              onChange={setActiveTab}
            />
          </>
        ) : (
          <div className="search-bar-inline">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            <button
              className="search-toggle-btn"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      <div className="friends-stats">
        <div
          className="stat-card"
          ref={onlineRef}
          onMouseEnter={() => setStatTooltip('online')}
          onMouseLeave={() => setStatTooltip(null)}
        >
          <div className="stat-number">{friends.filter(f => f.status === "online").length}</div>
          <div className="stat-label">Online</div>
          <FriendsStatTooltip
            friends={friends.filter(f => f.status === "online")}
            label="Online"
            visible={statTooltip === 'online'}
            anchorRef={onlineRef}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </div>
        <div
          className="stat-card"
          ref={ingameRef}
          onMouseEnter={() => setStatTooltip('in-game')}
          onMouseLeave={() => setStatTooltip(null)}
        >
          <div className="stat-number">{friends.filter(f => f.status === "in-game").length}</div>
          <div className="stat-label">In Game</div>
          <FriendsStatTooltip
            friends={friends.filter(f => f.status === "in-game")}
            label="In Game"
            visible={statTooltip === 'in-game'}
            anchorRef={ingameRef}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </div>
        <div
          className="stat-card"
          ref={favRef}
          onMouseEnter={() => setStatTooltip('favorites')}
          onMouseLeave={() => setStatTooltip(null)}
        >
          <div className="stat-number">{friends.filter(f => favoriteAnim[f.id] ?? f.isFavorite).length}</div>
          <div className="stat-label">Favorites</div>
          <FriendsStatTooltip
            friends={friends.filter(f => favoriteAnim[f.id] ?? f.isFavorite)}
            label="Favorites"
            visible={statTooltip === 'favorites'}
            anchorRef={favRef}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </div>
      </div>

      <div className="friends-grid">
        {filteredFriends.map((friend) => (
          <div key={friend.id} className="friend-card">
            <div className="friend-header">
              <div className="friend-avatar">
                <PersonIcon className="avatar-icon" />
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(friend.status) }}
                />
              </div>
              <div className="friend-info">
                <h3 className="friend-name">{friend.name}</h3>
                <div className="friend-level">Level {friend.level}</div>
              </div>
              <button
                className={`favorite-badge ${
                  favoriteAnim[friend.id] ? "anim" : ""
                }`}
                onClick={() => handleFavoriteClick(friend.id)}
              >
                <FavoriteIcon width={32} height={32} />{" "}
              </button>
            </div>

            <div className="friend-details">
              <div
                className="league-badge"
                style={{ borderColor: friend.leagueColor }}
              >
                <span className="league-name">{friend.league}</span>
              </div>

              <div className="status-info">
                <span
                  className="status-text"
                  style={{ color: getStatusColor(friend.status) }}
                >
                  {getStatusText(friend.status)}
                </span>
                {friend.status === "offline" && friend.lastSeen && (
                  <span className="last-seen">{friend.lastSeen}</span>
                )}
              </div>
            </div>

            <div className="friend-actions">
              <OXMButton
                variant="secondary"
                size="small"
                onClick={() => handleMessage(friend.id)}
              >
                <MessageIcon />
                Message
              </OXMButton>
              <button className="action-btn invite-btn">
                <GameIcon />
                Invite to Game
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFriends.length === 0 && (
        <div className="empty-state">
          <GroupIcon className="empty-icon" />
          <h3>No friends found</h3>
          <p>Try adjusting your search or add new friends to get started!</p>
          <OXMButton variant="primary" size="medium">
            Discover Players
          </OXMButton>
        </div>
      )}
    </div>
  );
};

export default Friends;
