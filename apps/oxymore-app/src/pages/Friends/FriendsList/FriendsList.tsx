import { OXMButton } from "@oxymore/ui";
import { Group as GroupIcon } from "@mui/icons-material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import type { FriendWithUser } from "../../../types/friend";
import { truncate } from "../../../utils";
import FriendCard from "../FriendCard/FriendCard";
import Avatar from "../../../components/Avatar/Avatar";
import "./FriendsList.scss";

interface FriendsListProps {
  activeTab: string;
  filteredFriends: FriendWithUser[];
  pendingRequests: FriendWithUser[];
  sentRequests: FriendWithUser[];
  viewMode: "card" | "list";
  onToggleFavorite: (friendId: string) => void;
  onMessage: (friendId: string) => void;
  onRename: (friend: FriendWithUser) => void;
  onDelete: (friend: FriendWithUser) => void;
  onAcceptRequest: (friendId: string) => void;
  onRejectRequest: (friendId: string) => void;
  onCancelRequest: (friendId: string) => void;
  onAddFriendClick: () => void;
  openedMenuId: string | null;
  onMenuToggle: (friendId: string | null) => void;
}

const FriendsList = ({
  activeTab,
  filteredFriends,
  pendingRequests,
  sentRequests,
  viewMode,
  onToggleFavorite,
  onMessage,
  onRename,
  onDelete,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onAddFriendClick,
  openedMenuId,
  onMenuToggle
}: FriendsListProps) => {
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

  return (
    <>
      <div className={`friends-grid ${viewMode === "list" ? "list-view" : "card-view"}`}>
        {(activeTab === 'all' || activeTab === 'online' || activeTab === 'favorites') && filteredFriends.map((friend) => (
          <FriendCard
            key={friend.id_friend}
            friend={friend}
            viewMode={viewMode}
            onToggleFavorite={onToggleFavorite}
            onMessage={onMessage}
            onRename={onRename}
            onDelete={onDelete}
            openedMenuId={openedMenuId}
            onMenuToggle={onMenuToggle}
          />
        ))}

        {activeTab === 'pending' && pendingRequests.map((request) => (
          <div key={request.id_friend} className={`friend-card pending-request ${viewMode === "list" ? "list-item" : ""}`}>
            <div className="friend-header">
              <div className="friend-avatar">
                <Avatar
                  username={request.username}
                  avatarUrl={request.avatar_url}
                  size={viewMode === "list" ? 50 : 64}
                  className="avatar-image"
                />
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(request.online_status || "offline") }}
                />
              </div>
              <div className="friend-info">
                <div className="friend-name-wrapper">
                  <h3 className="friend-name">{truncate(request.username, 30)}</h3>
                </div>
                <div className="request-status">Friend request</div>
              </div>
            </div>

            {viewMode === "card" && (
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
            )}

            <div className="friend-actions">
              {viewMode === "list" && (
                <span
                  className="status-text-inline"
                  style={{ color: getStatusColor(request.online_status || "offline") }}
                >
                  {getStatusText(request.online_status || "offline")}
                </span>
              )}
              <OXMButton
                variant="primary"
                size="small"
                onClick={() => onAcceptRequest(request.id_friend)}
              >
                <CheckIcon />
                Accept
              </OXMButton>
              <OXMButton
                variant="secondary"
                size="small"
                onClick={() => onRejectRequest(request.id_friend)}
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
                <Avatar
                  username={request.username}
                  avatarUrl={request.avatar_url}
                  size={viewMode === "list" ? 50 : 64}
                  className="avatar-image"
                />
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(request.online_status || "offline") }}
                />
              </div>
              <div className="friend-info">
                <div className="friend-name-wrapper">
                  <h3 className="friend-name">{truncate(request.username, 30)}</h3>
                </div>
                <div className="request-status">Request sent</div>
              </div>
            </div>

            {viewMode === "card" && (
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
            )}

            <div className="friend-actions">
              {viewMode === "list" && (
                <span
                  className="status-text-inline"
                  style={{ color: getStatusColor(request.online_status || "offline") }}
                >
                  {getStatusText(request.online_status || "offline")}
                </span>
              )}
              <OXMButton
                variant="secondary"
                size="small"
                onClick={() => onCancelRequest(request.id_friend)}
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
            onClick={onAddFriendClick}
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
            onClick={onAddFriendClick}
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
            onClick={onAddFriendClick}
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
            onClick={onAddFriendClick}
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
            onClick={onAddFriendClick}
          >
            Add Friends
          </OXMButton>
        </div>
      )}
    </>
  );
};

export default FriendsList;


