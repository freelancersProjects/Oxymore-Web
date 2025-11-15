import React from "react";
import Avatar from "../../../components/Avatar/Avatar";
import { truncate } from "../../../utils/truncate";
import type { Conversation } from "../../../types/privateMessage";
import "./ConversationItem.scss";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  getStatusColor: (status: string) => string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
  getStatusColor,
}) => {
  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        <Avatar
          username={conversation.other_display_name || conversation.other_username}
          avatarUrl={conversation.other_avatar_url}
          size={48}
          className="avatar-image"
        />
        <div
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(conversation.other_online_status || "offline") }}
        />
      </div>
      <div className="conversation-info">
        <div className="conversation-header">
          <h3 className="conversation-name">{conversation.other_display_name || conversation.other_username}</h3>
          {conversation.last_message && (
            <span className="conversation-time">
              {new Date(conversation.last_message.sent_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
        <div className="conversation-preview">
          <p className="last-message">
            {conversation.last_message ? truncate(conversation.last_message.content, 50) : "No messages yet"}
          </p>
          {conversation.unread_count > 0 && (
            <span className="unread-badge">{conversation.unread_count}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;



