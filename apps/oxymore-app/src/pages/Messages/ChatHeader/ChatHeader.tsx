import React from "react";
import Avatar from "../../../components/Avatar/Avatar";
import type { Conversation } from "../../../types/privateMessage";
import "./ChatHeader.scss";

interface ChatHeaderProps {
  conversation: Conversation;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  getStatusColor,
  getStatusText,
}) => {
  return (
    <div className="chat-header-bar">
      <div className="chat-user-info">
        <div className="chat-user-avatar">
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
        <div className="chat-user-details">
                    <h2 className="chat-user-name">{conversation.other_display_name || conversation.other_username}</h2>
          <span
            className="chat-user-status"
            style={{ color: getStatusColor(conversation.other_online_status || "offline") }}
          >
            {getStatusText(conversation.other_online_status || "offline")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;



