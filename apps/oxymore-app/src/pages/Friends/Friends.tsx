import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { friendService } from "../../services/friendService";
import type { FriendWithUser } from "../../types/friend";
import { toLowerCase } from "../../utils";
import { usePresenceSocket } from "../../hooks/usePresenceSocket";
import { useFriendRequestSocket } from "../../hooks/useFriendRequestSocket";
import FriendsHeader from "./FriendsHeader/FriendsHeader";
import FriendsFilters from "./FriendsFilters/FriendsFilters";
import FriendsStats from "./FriendsStats/FriendsStats";
import FriendsList from "./FriendsList/FriendsList";
import AddFriendModal from "./AddFriendModal/AddFriendModal";
import RenameFriendModal from "./RenameFriendModal";
import DeleteConfirmModal from "./DeleteConfirmModal/DeleteConfirmModal";
import "./Friends.scss";

const VALID_TABS = ["all", "online", "favorites", "pending", "sent"];
const VALID_VIEW_MODES = ["card", "list"];

const Friends = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      return tabFromUrl;
    }
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">(() => {
    const viewModeFromUrl = searchParams.get('view');
    if (viewModeFromUrl && VALID_VIEW_MODES.includes(viewModeFromUrl)) {
      return viewModeFromUrl as "card" | "list";
    }
    return "list";
  });
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friends, setFriends] = useState<FriendWithUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendWithUser[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendWithUser[]>([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamingFriend, setRenamingFriend] = useState<FriendWithUser | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<FriendWithUser | null>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (!tabFromUrl) {
      setActiveTab("all");
      setSearchParams({ tab: "all" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const viewModeFromUrl = searchParams.get('view');
    if (viewModeFromUrl && VALID_VIEW_MODES.includes(viewModeFromUrl)) {
      setViewMode(viewModeFromUrl as "card" | "list");
    } else if (!viewModeFromUrl) {
      setViewMode("list");
      const currentParams = Object.fromEntries(searchParams);
      setSearchParams({ ...currentParams, view: "list" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!user?.id_user) return;

    const loadData = async () => {
      try {
        const [friendsData, pendingData, sentData] = await Promise.all([
          friendService.getAllFriends(user.id_user),
          friendService.getPendingRequests(user.id_user),
          friendService.getSentRequests(user.id_user)
        ]);
        setFriends(friendsData);
        setPendingRequests(pendingData);
        setSentRequests(sentData);
      } catch (error) {
      }
    };

    loadData();
  }, [user]);

  usePresenceSocket({
    onUserOnline: (data) => {
      setFriends(prevFriends =>
        prevFriends.map(friend =>
          friend.user_id === data.user_id
            ? { ...friend, online_status: 'online' }
            : friend
        )
      );
    },
    onUserOffline: (data) => {
      setFriends(prevFriends =>
        prevFriends.map(friend =>
          friend.user_id === data.user_id
            ? { ...friend, online_status: 'offline' }
            : friend
        )
      );
    }
  });

  useFriendRequestSocket({
    onFriendRequestReceived: async (friendRequest) => {
      if (user?.id_user) {
        if (friendRequest.id_user_receiver === user.id_user) {
          const pending = await friendService.getPendingRequests(user.id_user);
          setPendingRequests(pending);
        }
        if (friendRequest.id_user_sender === user.id_user) {
          const sent = await friendService.getSentRequests(user.id_user);
          setSentRequests(sent);
        }
      }
    },
    onFriendRequestAccepted: async (friendData) => {
      if (user?.id_user) {
        const [friendsData, pendingData, sentData] = await Promise.all([
          friendService.getAllFriends(user.id_user),
          friendService.getPendingRequests(user.id_user),
          friendService.getSentRequests(user.id_user)
        ]);
        setFriends(friendsData);
        setPendingRequests(pendingData);
        setSentRequests(sentData);
      }
    },
    onFriendRequestRejected: async (data) => {
      if (user?.id_user) {
        const sent = await friendService.getSentRequests(user.id_user);
        setSentRequests(sent);
      }
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openedMenuId && !target.closest('.friend-menu-wrapper') && !target.closest('.friend-menu-dropdown')) {
        setOpenedMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openedMenuId]);

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch = toLowerCase(friend.username).includes(toLowerCase(searchQuery));

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
    navigate(`/messages?friend=${friendId}`);
  };

  const handleToggleFavorite = async (friendId: string) => {
    if (!user?.id_user) return;
    try {
      setFriends(prevFriends => 
        prevFriends.map(friend => 
          friend.id_friend === friendId 
            ? { ...friend, is_favorite: !friend.is_favorite }
            : friend
        )
      );
      
      const result = await friendService.toggleFavorite(user.id_user, friendId);
      
      setFriends(prevFriends => 
        prevFriends.map(friend => 
          friend.id_friend === friendId 
            ? { ...friend, is_favorite: result.is_favorite }
            : friend
        )
      );
    } catch (error) {
      if (user?.id_user) {
        const friends = await friendService.getAllFriends(user.id_user);
        setFriends(friends);
      }
    }
  };

  const handleDeleteFriend = (friend: FriendWithUser) => {
    setFriendToDelete(friend);
    setShowDeleteConfirmModal(true);
    setOpenedMenuId(null);
  };

  const handleConfirmDeleteFriend = async () => {
    if (!friendToDelete) return;

    try {
      await friendService.deleteFriend(friendToDelete.id_friend);
      if (user?.id_user) {
        const friends = await friendService.getAllFriends(user.id_user);
        setFriends(friends);
      }
      setShowDeleteConfirmModal(false);
      setFriendToDelete(null);
    } catch (error) {
    }
  };

  const handleRenameFriend = (friend: FriendWithUser) => {
    setRenamingFriend(friend);
    setShowRenameModal(true);
    setOpenedMenuId(null);
  };

  const handleRenameSuccess = async () => {
    if (user?.id_user) {
      const friends = await friendService.getAllFriends(user.id_user);
      setFriends(friends);
    }
  };

  const handleAddFriend = async (userId: string) => {
    if (!user?.id_user) return;

    try {
      await friendService.addFriend(user.id_user, userId);
      setShowAddFriendModal(false);
      
      const sent = await friendService.getSentRequests(user.id_user);
      setSentRequests(sent);
      
      setActiveTab("sent");
      setSearchParams({ tab: "sent" }, { replace: true });
    } catch (error) {
    }
  };

  const handleCancelRequest = async (friendId: string) => {
    try {
      await friendService.cancelRequest(friendId);
      if (user?.id_user) {
        const requests = await friendService.getSentRequests(user.id_user);
        setSentRequests(requests);
      }
    } catch (error) {
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    try {
      await friendService.acceptRequest(friendId);
      if (user?.id_user) {
        const [requests, friendsData] = await Promise.all([
          friendService.getPendingRequests(user.id_user),
          friendService.getAllFriends(user.id_user)
        ]);
        setPendingRequests(requests);
        setFriends(friendsData);
      }
    } catch (error) {
    }
  };

  const handleRejectRequest = async (friendId: string) => {
    try {
      await friendService.rejectRequest(friendId);
      if (user?.id_user) {
        const requests = await friendService.getPendingRequests(user.id_user);
        setPendingRequests(requests);
      }
    } catch (error) {
    }
  };

  const onlineCount = friends.filter(f => f.online_status === "online").length;
  const inGameCount = friends.filter(f => f.online_status === "in-game").length;
  const favoritesCount = friends.filter(f => f.is_favorite).length;

  return (
    <div className="friends-container">
      <FriendsHeader onAddFriendClick={() => setShowAddFriendModal(true)} />

      <FriendsFilters
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          const currentParams = Object.fromEntries(searchParams);
          setSearchParams({ ...currentParams, tab }, { replace: true });
        }}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          const currentParams = Object.fromEntries(searchParams);
          setSearchParams({ ...currentParams, view: mode }, { replace: true });
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sentRequestsCount={sentRequests.length}
        pendingRequestsCount={pendingRequests.length}
      />

      <FriendsStats
        onlineCount={onlineCount}
        inGameCount={inGameCount}
        favoritesCount={favoritesCount}
      />

      <FriendsList
        activeTab={activeTab}
        filteredFriends={filteredFriends}
        pendingRequests={pendingRequests}
        sentRequests={sentRequests}
        viewMode={viewMode}
        onToggleFavorite={handleToggleFavorite}
        onMessage={handleMessage}
        onRename={handleRenameFriend}
        onDelete={handleDeleteFriend}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        onCancelRequest={handleCancelRequest}
        onAddFriendClick={() => setShowAddFriendModal(true)}
        openedMenuId={openedMenuId}
        onMenuToggle={setOpenedMenuId}
      />

      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        userId={user?.id_user || ""}
        onAddFriend={handleAddFriend}
      />

      <RenameFriendModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setRenamingFriend(null);
        }}
        friend={renamingFriend}
        userId={user?.id_user || ""}
        onSuccess={handleRenameSuccess}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setFriendToDelete(null);
        }}
        friend={friendToDelete}
        onConfirm={handleConfirmDeleteFriend}
      />
    </div>
  );
};

export default Friends;
