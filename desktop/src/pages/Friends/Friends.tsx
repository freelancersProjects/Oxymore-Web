import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { friendService } from "../../services/friendService";
import type { FriendWithUser } from "../../types/friend";
import { toLowerCase } from "../../utils";
import FriendsHeader from "./FriendsHeader/FriendsHeader";
import FriendsFilters from "./FriendsFilters/FriendsFilters";
import FriendsStats from "./FriendsStats/FriendsStats";
import FriendsList from "./FriendsList/FriendsList";
import AddFriendModal from "./AddFriendModal/AddFriendModal";
import RenameFriendModal from "./RenameFriendModal";
import DeleteConfirmModal from "./DeleteConfirmModal/DeleteConfirmModal";
import "./Friends.scss";

const Friends = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
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
        console.error('Error loading friends data:', error);
      }
    };

    loadData();
  }, [user]);

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
      console.error('Error toggling favorite:', error);
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
      console.error('Error deleting friend:', error);
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
    } catch (error) {
      console.error('Error adding friend:', error);
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
      console.error('Error canceling friend request:', error);
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
      console.error('Error accepting friend request:', error);
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
      console.error('Error rejecting friend request:', error);
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
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
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
