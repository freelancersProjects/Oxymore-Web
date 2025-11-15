import React from "react";
import { Search, X, MessageSquare } from "lucide-react";
import type { Conversation } from "../../../types/privateMessage";
import ConversationItem from "../ConversationItem/ConversationItem";
import EmptyConversations from "../EmptyStates/EmptyConversations";
import "./MessagesSidebar.scss";

interface MessagesSidebarProps {
  conversations: Conversation[];
  activeChat: string | null;
  searchQuery: string;
  showSearch: boolean;
  onConversationClick: (userId: string) => void;
  onSearchToggle: () => void;
  onSearchChange: (query: string) => void;
  onSearchClose: () => void;
  getStatusColor: (status: string) => string;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({
  conversations,
  activeChat,
  searchQuery,
  showSearch,
  onConversationClick,
  onSearchToggle,
  onSearchChange,
  onSearchClose,
  getStatusColor,
}) => {
  const filteredConversations = conversations.filter(conv => {
    const displayName = conv.other_display_name || conv.other_username;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="messages-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Messages</h1>
        <button
          className={`search-toggle-btn ${showSearch ? "active" : ""}`}
          onClick={onSearchToggle}
          title="Search Conversations"
        >
          <Search size={20} />
        </button>
      </div>

      {showSearch && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            autoFocus
          />
          <button
            className="search-close-btn"
            onClick={onSearchClose}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <EmptyConversations />
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.other_user_id}
              conversation={conv}
              isActive={activeChat === conv.other_user_id}
              onClick={() => onConversationClick(conv.other_user_id)}
              getStatusColor={getStatusColor}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesSidebar;



