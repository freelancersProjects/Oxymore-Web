import { useState, useRef, useEffect, useCallback } from "react";
import { OXMButton } from "@oxymore/ui";
import {
  Person as PersonIcon,
  Message as MessageIcon,
  SportsEsports as GameIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  ViewList as ListIcon,
  ViewModule as CardIcon
} from "@mui/icons-material";
import { Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../api/apiService";
import type { FriendWithUser, UserSearchResult } from "../../types/friend";
import "./Friends.scss";

const Friends = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchAnimation, setSearchAnimation] = useState(false);

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [friends, setFriends] = useState<FriendWithUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendWithUser[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendWithUser[]>([]);

  useEffect(() => {
    if (!user?.id_user) return;

    apiService.get(`/friends/user/${user.id_user}`).then((data) => {
      setFriends(data);
    }).catch((error) => {
      console.error('Error loading friends:', error);
    });

    apiService.get(`/friends/pending/${user.id_user}`).then((data) => {
      setPendingRequests(data);
    }).catch((error) => {
      console.error('Error loading pending requests:', error);
    });

    apiService.get(`/friends/sent/${user.id_user}`).then((data) => {
      setSentRequests(data);
    }).catch((error) => {
      console.error('Error loading sent requests:', error);
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const tabs = [
    { value: "all", label: "All Friends" },
    { value: "online", label: "Online" },
    { value: "favorites", label: "Favorites" },
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
  ];

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch = friend.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "online") {
      return matchesSearch && friend.online_status === "online";
    } else if (activeTab === "favorites") {
      return matchesSearch && friend.is_favorite;
    } else if (activeTab === "pending") {
      return matchesSearch && friend.status === "pending";
    }

    return matchesSearch;
  });

  const handleMessage = (friendId: string) => {
    window.location.href = `/messages?friend=${friendId}`;
  };

  const handleInviteToGame = (friendId: string) => {
    console.log(`Invite friend ${friendId} to game`);
  };

  const handleToggleFavorite = async (friendId: string) => {
    try {
      await apiService.put(`/friends/${friendId}/toggle-favorite`);
      if (user?.id_user) {
        const friends = await apiService.get(`/friends/user/${user.id_user}`);
        setFriends(friends);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchAnimation(true);
    setTimeout(() => setSearchAnimation(false), 300);
  };



  const handleSearchUsers = useCallback(async (query: string) => {
    if (!query.trim() || !user?.id_user) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await apiService.get(`/friends/search/${user.id_user}?q=${encodeURIComponent(query)}`);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [user?.id_user]);

  const handleAddFriend = async (userId: string) => {
    if (!user?.id_user) return;

    try {
      await apiService.post('/friends', {
        id_user_sender: user.id_user,
        id_user_receiver: userId,
        status: 'pending'
      });
      setShowAddFriendModal(false);
      setUserSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleCancelRequest = async (friendId: string) => {
    try {
      await apiService.delete(`/friends/${friendId}/cancel`);
      if (user?.id_user) {
        const requests = await apiService.get(`/friends/sent/${user.id_user}`);
        setSentRequests(requests);
      }
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    try {
      await apiService.put(`/friends/${friendId}/accept`);
      if (user?.id_user) {
        const requests = await apiService.get(`/friends/pending/${user.id_user}`);
        setPendingRequests(requests);
        const friends = await apiService.get(`/friends/user/${user.id_user}`);
        setFriends(friends);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (friendId: string) => {
    try {
      await apiService.put(`/friends/${friendId}/reject`);
      if (user?.id_user) {
        const requests = await apiService.get(`/friends/pending/${user.id_user}`);
        setPendingRequests(requests);
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#4ADE80";
      case "in-game":
        return "#FACC15";
      case "offline":
        return "#888";
      default:
        return "#888";
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

  const getEloColor = (elo: number) => {
    if (elo >= 2000) return "#FACC15";
    if (elo >= 1500) return "#E0E0E0";
    if (elo >= 1000) return "#CD7F32";
    return "#888";
  };

  return (
    <div className="friends-container">
      {/* <OXMGlowOrb top="10%" left="5%" size="300px" color="#500CAD" />
      <OXMGlowOrb top="60%" right="10%" size="250px" color="#1593CE" /> */}

      <div className="friends-header">
        <div className="header-content">
          <h1 className="friends-title white">Friends</h1>
          <p className="friends-subtitle">Connect with your gaming squad</p>
        </div>

        <div className="header-actions">
          <OXMButton
            variant="primary"
            size="medium"
            onClick={() => setShowAddFriendModal(true)}
          >
            <AddIcon />
            Add Friend
          </OXMButton>
        </div>
      </div>

      <div className="friends-tabs-search">
        <div className="tabs-container">
          <div className="custom-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`tab-button ${activeTab === tab.value ? "active" : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="view-controls">
            <button
              className={`view-toggle-btn ${viewMode === "card" ? "active" : ""}`}
              onClick={() => setViewMode("card")}
              title="Card View"
            >
              <CardIcon />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <ListIcon />
            </button>
            <button
              className={`search-toggle-btn ${searchAnimation ? "anim" : ""}`}
              onClick={handleToggleSearch}
              title="Search Friends"
            >
              <SearchIcon className="custom-search-icon" />
            </button>
          </div>
        </div>

        {showSearch && (
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
              className="search-close-btn"
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
        <div className="stat-card">
          <div className="stat-number">{friends.filter(f => f.online_status === "online").length}</div>
          <div className="stat-label">Online</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{friends.filter(f => f.online_status === "in-game").length}</div>
          <div className="stat-label">In Game</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{friends.filter(f => f.is_favorite).length}</div>
          <div className="stat-label">Favorites</div>
        </div>
      </div>

      <div className={`friends-grid ${viewMode === "list" ? "list-view" : "card-view"}`}>
        {activeTab === 'all' && filteredFriends.map((friend) => (
          <div key={friend.id_friend} className={`friend-card ${viewMode === "list" ? "list-item" : ""}`}>
            <div className="friend-header">
              <div className="friend-avatar">
                <PersonIcon className="avatar-icon" />
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(friend.online_status || "offline") }}
                />
              </div>
              <div className="friend-info">
                <h3 className="friend-name">{friend.username}</h3>
                <div className="friend-elo" style={{ color: getEloColor(friend.elo) }}>
                  ELO {friend.elo}
                </div>
              </div>
              <button
                className={`favorite-badge ${friend.is_favorite ? "active" : ""}`}
                onClick={() => handleToggleFavorite(friend.user_id)}
              >
                <Heart
                  size={24}
                  fill={friend.is_favorite ? "#8B5CF6" : "none"}
                  color={friend.is_favorite ? "#8B5CF6" : "#6B7280"}
                />
              </button>
            </div>

            <div className="friend-details">
              <div className="status-info">
                <span
                  className="status-text"
                  style={{ color: getStatusColor(friend.online_status || "offline") }}
                >
                  {getStatusText(friend.online_status || "offline")}
                </span>
                {friend.online_status === "offline" && friend.last_seen && (
                  <span className="last-seen">{friend.last_seen}</span>
                )}
              </div>
            </div>

            <div className="friend-actions">
              <OXMButton
                variant="secondary"
                size="small"
                onClick={() => handleMessage(friend.user_id)}
              >
                <MessageIcon />
                Message
              </OXMButton>
              <button className="action-btn invite-btn" onClick={() => handleInviteToGame(friend.user_id)}>
                <GameIcon />
                Invite to Game
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'pending' && pendingRequests.map((request) => (
          <div key={request.id_friend} className={`friend-card pending-request ${viewMode === "list" ? "list-item" : ""}`}>
            <div className="friend-header">
              <div className="friend-avatar">
                <PersonIcon className="avatar-icon" />
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(request.online_status || "offline") }}
                />
              </div>
              <div className="friend-info">
                <h3 className="friend-name">{request.username}</h3>
                <div className="friend-elo" style={{ color: getEloColor(request.elo) }}>
                  ELO {request.elo}
                </div>
                <div className="request-status">Friend request</div>
              </div>
            </div>

            <div className="friend-details">
              <div className="status-info">
                <span
                  className="status-text"
                  style={{ color: getStatusColor(request.online_status || "offline") }}
                >
                  {getStatusText(request.online_status || "offline")}
                </span>
              </div>
            </div>

            <div className="friend-actions">
              <OXMButton
                variant="primary"
                size="small"
                onClick={() => handleAcceptRequest(request.id_friend)}
              >
                <CheckIcon />
                Accept
              </OXMButton>
              <OXMButton
                variant="secondary"
                size="small"
                onClick={() => handleRejectRequest(request.id_friend)}
              >
                <CloseIcon />
                Reject
              </OXMButton>
            </div>
          </div>
        ))}

        {activeTab === 'sent' && sentRequests.map((request) => (
          <div key={request.id_friend} className={`friend-card pending-request ${viewMode === "list" ? "list-item" : ""}`}>
            <div className="friend-header">
              <div className="friend-avatar">
                <PersonIcon className="avatar-icon" />
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(request.online_status || "offline") }}
                />
              </div>
              <div className="friend-info">
                <h3 className="friend-name">{request.username}</h3>
                <div className="friend-elo" style={{ color: getEloColor(request.elo) }}>
                  ELO {request.elo}
                </div>
                <div className="request-status">Request sent</div>
              </div>
            </div>

            <div className="friend-details">
              <div className="status-info">
                <span
                  className="status-text"
                  style={{ color: getStatusColor(request.online_status || "offline") }}
                >
                  {getStatusText(request.online_status || "offline")}
                </span>
              </div>
            </div>

            <div className="friend-actions">
              <OXMButton
                variant="secondary"
                size="small"
                onClick={() => handleCancelRequest(request.id_friend)}
              >
                <CloseIcon />
                Cancel Request
              </OXMButton>
            </div>
          </div>
        ))}
      </div>

             {activeTab === 'all' && filteredFriends.length === 0 && (
         <div className="empty-state">
           <GroupIcon className="empty-icon" />
           <h3>No friends found</h3>
           <p>Try adjusting your search or add new friends to get started!</p>
           <OXMButton
             variant="primary"
             size="medium"
             onClick={() => setShowAddFriendModal(true)}
           >
             Add Friends
           </OXMButton>
         </div>
       )}

       {activeTab === 'online' && filteredFriends.length === 0 && (
         <div className="empty-state">
           <GroupIcon className="empty-icon" />
           <h3>No online friends</h3>
           <p>None of your friends are currently online.</p>
           <OXMButton
             variant="primary"
             size="medium"
             onClick={() => setShowAddFriendModal(true)}
           >
             Add Friends
           </OXMButton>
         </div>
       )}

       {activeTab === 'favorites' && filteredFriends.length === 0 && (
         <div className="empty-state">
           <GroupIcon className="empty-icon" />
           <h3>No favorite friends</h3>
           <p>You haven't marked any friends as favorites yet.</p>
           <OXMButton
             variant="primary"
             size="medium"
             onClick={() => setShowAddFriendModal(true)}
           >
             Add Friends
           </OXMButton>
         </div>
       )}

       {activeTab === 'pending' && pendingRequests.length === 0 && (
         <div className="empty-state">
           <GroupIcon className="empty-icon" />
           <h3>No pending requests</h3>
           <p>You don't have any friend requests waiting for your response.</p>
           <OXMButton
             variant="primary"
             size="medium"
             onClick={() => setShowAddFriendModal(true)}
           >
             Add Friends
           </OXMButton>
         </div>
       )}

       {activeTab === 'sent' && sentRequests.length === 0 && (
         <div className="empty-state">
           <GroupIcon className="empty-icon" />
           <h3>No sent requests</h3>
           <p>You haven't sent any friend requests yet.</p>
           <OXMButton
             variant="primary"
             size="medium"
             onClick={() => setShowAddFriendModal(true)}
           >
             Add Friends
           </OXMButton>
         </div>
       )}

      {showAddFriendModal && (
        <div className="modal-overlay" onClick={() => setShowAddFriendModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2 className="modal-title orbitron">Find New Friends</h2>
                <p className="modal-subtitle">Search and connect with players around the world</p>
              </div>
              <button className="modal-close" onClick={() => setShowAddFriendModal(false)}>
                <CloseIcon />
              </button>
            </div>
        <div className="add-friend-modal">
          <div className="search-section">
            <div className="search-input-wrapper">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search for players..."
                value={userSearchQuery}
                                                onChange={(e) => {
                  const value = e.target.value;
                  setUserSearchQuery(value);

                  if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                  }

                  if (value.trim()) {
                    searchTimeoutRef.current = setTimeout(() => {
                      handleSearchUsers(value);
                    }, 300);
                  } else {
                    setSearchResults([]);
                  }
                }}
                className="user-search-input"
              />
              {userSearchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => {
                    setUserSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>

          <div className="search-results">
            {isSearching && (
              <div className="loading-results">
                <p>Searching...</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="results-list">
                {searchResults.map((user) => (
                  <div key={user.id_user} className="user-result-item">
                    <div className="user-info">
                      <PersonIcon className="user-avatar" />
                      <div className="user-details">
                        <h4 className="user-name">{user.username}</h4>
                        <span className="user-elo" style={{ color: getEloColor(user.elo) }}>
                          ELO {user.elo}
                        </span>
                      </div>
                    </div>
                    <div className="user-actions">
                      {user.friend_status === 'pending' ? (
                        <span className="status-badge pending">Request Sent</span>
                      ) : user.friend_status === 'accepted' ? (
                        <span className="status-badge accepted">Already Friends</span>
                      ) : (
                        <button
                          className="add-friend-btn"
                          onClick={() => handleAddFriend(user.id_user)}
                        >
                          <AddIcon />
                          Add Friend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && userSearchQuery && searchResults.length === 0 && !user?.id_user && (
              <div className="no-results">
                <p>Please log in to search for users</p>
              </div>
            )}

            {!isSearching && userSearchQuery && searchResults.length === 0 && user?.id_user && (
              <div className="no-results">
                <p>No users found matching "{userSearchQuery}"</p>
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
