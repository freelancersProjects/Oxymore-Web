import { OXMButton } from "@oxymore/ui";
import { Message as MessageIcon } from "@mui/icons-material";
import { Heart, MoreVertical, Trash2, Edit2 } from "lucide-react";
import type { FriendWithUser } from "../../../types/friend";
import { truncate } from "../../../utils";
import Avatar from "../../../components/Avatar/Avatar";
import "./FriendCard.scss";

interface FriendCardProps {
  friend: FriendWithUser;
  viewMode: "card" | "list";
  onToggleFavorite: (friendId: string) => void;
  onMessage: (friendId: string) => void;
  onRename: (friend: FriendWithUser) => void;
  onDelete: (friend: FriendWithUser) => void;
  openedMenuId: string | null;
  onMenuToggle: (friendId: string | null) => void;
}

const FriendCard = ({
  friend,
  viewMode,
  onToggleFavorite,
  onMessage,
  onRename,
  onDelete,
  openedMenuId,
  onMenuToggle
}: FriendCardProps) => {
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
    <div className={`friend-card ${viewMode === "list" ? "list-item" : ""}`}>
      <div className="friend-header">
        <div className="friend-avatar">
          <Avatar
            username={friend.display_name || friend.username}
            avatarUrl={friend.avatar_url}
            size={viewMode === "list" ? 50 : 64}
            className="avatar-image"
          />
          <div
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(friend.online_status || "offline") }}
          />
        </div>
        <div className="friend-info">
          <div className="friend-name-wrapper">
            <h3 className="friend-name">{truncate(friend.display_name || friend.username, viewMode === "card" ? 15 : 30)}</h3>
            {viewMode === "list" && (
              <span
                className="status-text-inline"
                style={{ color: getStatusColor(friend.online_status || "offline") }}
              >
                {getStatusText(friend.online_status || "offline")}
              </span>
            )}
          </div>
        </div>
        <div className="friend-header-actions">
          <button
            className={`favorite-badge ${friend.is_favorite ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(friend.id_friend);
            }}
          >
            <Heart
              size={24}
              fill={friend.is_favorite ? "#1593CE" : "none"}
              color={friend.is_favorite ? "#1593CE" : "#6B7280"}
            />
          </button>
          <div className="friend-menu-wrapper">
            <button
              className="friend-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle(openedMenuId === friend.id_friend ? null : friend.id_friend);
              }}
            >
              <MoreVertical size={20} />
            </button>
            {openedMenuId === friend.id_friend && (
              <div className="friend-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                <button
                  className="friend-menu-item"
                  onClick={() => onRename(friend)}
                >
                  <Edit2 size={16} />
                  Renommer
                </button>
                <button
                  className="friend-menu-item delete"
                  onClick={() => onDelete(friend)}
                >
                  <Trash2 size={16} />
                  Supprimer l'ami
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === "card" && <hr className="friend-separator" />}

      <div className="friend-actions">
        <OXMButton
          variant="secondary"
          size="small"
          onClick={() => onMessage(friend.user_id)}
        >
          <MessageIcon />
          Message
        </OXMButton>
      </div>
    </div>
  );
};

export default FriendCard;


