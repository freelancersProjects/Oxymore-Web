import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Send as SendIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../api/apiService";
import type { FriendWithUser } from "../../types/friend";
import "./Messages.scss";

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

const generateAvatarWithInitial = (username: string, size: number = 48) => {
  const initial = username.charAt(0).toUpperCase();
  const colorIndex = username.charCodeAt(0) % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];

  return (
    <div
      className="avatar-initial"
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
        fontFamily: 'Orbitron, sans-serif'
      }}
    >
      {initial}
    </div>
  );
};

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

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

interface Chat {
  friend: FriendWithUser;
  lastMessage?: Message;
  unreadCount: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id_user) return;

    loadChats();

    const friendId = searchParams.get('friend');
    if (friendId) {
      setActiveChat(friendId);
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (activeChat) {
      loadMessages();
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      const conversations = await apiService.get('/private-messages/conversations');

      const chatsWithData: Chat[] = conversations.map((conv: any) => ({
        friend: {
          user_id: conv.other_user_id,
          username: conv.other_username,
          avatar_url: conv.other_avatar_url,
          online_status: conv.other_online_status
        },
        lastMessage: undefined,
        unreadCount: conv.unread_count || 0
      }));

      setChats(chatsWithData);
    } catch (error) {
      try {
        const friends = await apiService.get(`/friends/user/${user?.id_user}`);

        const chatsWithData: Chat[] = friends.map((friend: FriendWithUser) => ({
          friend,
          lastMessage: undefined,
          unreadCount: 0
        }));

        setChats(chatsWithData);
      } catch (fallbackError) {
        console.error('Error loading chats:', fallbackError);
      }
    }
  };

  const loadMessages = async () => {
    if (!activeChat || !user?.id_user) return;

    try {
      const messagesData = await apiService.get(`/private-messages/${activeChat}`);

      const formattedMessages: Message[] = messagesData.map((msg: any) => ({
        id: msg.id_private_message.toString(),
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        content: msg.content,
        timestamp: msg.sent_at,
        is_read: msg.is_read
      }));

      setMessages(formattedMessages);
    } catch (error) {
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !user?.id_user) return;

    const messageText = newMessage.trim();
    if (messageText.length > 500) {
      alert("Le message ne peut pas dépasser 500 caractères");
      return;
    }

    try {
      const response = await apiService.post('/private-messages', {
        content: messageText,
        receiver_id: activeChat
      });

      const newMsg: Message = {
        id: response.id_private_message.toString(),
        sender_id: response.sender_id,
        receiver_id: response.receiver_id,
        content: response.content,
        timestamp: response.sent_at,
        is_read: response.is_read
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
    } catch (error) {
      alert("Erreur lors de l'envoi du message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = chats.find(chat => chat.friend.user_id === activeChat);

  return (
    <div className="messages-container">
      <div className="messages-layout">
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title orbitron">Messages</h1>
            <div className="sidebar-actions">
              <button
                className={`search-toggle-btn ${showSearch ? "active" : ""}`}
                onClick={() => setShowSearch(!showSearch)}
                title="Search Chats"
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search conversations..."
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

          <div className="chats-list">
            {filteredChats.length === 0 ? (
              <div className="empty-chats">
                <p>No conversations yet</p>
                <p className="empty-subtitle">Start chatting with your friends!</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.friend.user_id}
                  className={`chat-item ${activeChat === chat.friend.user_id ? "active" : ""}`}
                  onClick={() => setActiveChat(chat.friend.user_id)}
                >
                  <div className="chat-avatar">
                    <Avatar username={chat.friend.username} size={48} />
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(chat.friend.online_status || "offline") }}
                    />
                  </div>

                  <div className="chat-info">
                    <div className="chat-header">
                      <h3 className="chat-name">{chat.friend.username}</h3>
                      {chat.lastMessage && (
                        <span className="chat-time">
                          {formatTimestamp(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="chat-preview">
                      <p className="last-message">
                        {chat.lastMessage ? chat.lastMessage.content : "No messages yet"}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="unread-badge">{chat.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="messages-main">
          {activeChat && currentChat ? (
            <>
              <div className="chat-header-bar">
                <div className="chat-user-info">
                  <div className="chat-user-avatar">
                    <Avatar username={currentChat.friend.username} size={48} />
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(currentChat.friend.online_status || "offline") }}
                    />
                  </div>
                  <div className="chat-user-details">
                    <h2 className="chat-user-name">{currentChat.friend.username}</h2>
                    <span
                      className="chat-user-status"
                      style={{ color: getStatusColor(currentChat.friend.online_status || "offline") }}
                    >
                      {getStatusText(currentChat.friend.online_status || "offline")}
                    </span>
                  </div>
                </div>
                <button className="chat-options-btn">
                  <MoreIcon />
                </button>
              </div>

              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="empty-messages">
                    <div className="empty-icon">
                      <SendIcon />
                    </div>
                    <h3>Start the conversation</h3>
                    <p>Send your first message to {currentChat.friend.username}</p>
                  </div>
                ) : (
                  <div className="messages-list">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.sender_id === user?.id_user ? "sent" : "received"}`}
                      >
                        <div className="message-content">
                          <p>{message.content}</p>
                          <span className="message-time">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="message-input-area">
                <div className="message-input-wrapper">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder={`Message ${currentChat.friend.username}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="message-input"
                      maxLength={500}
                    />
                    <div className="char-counter">
                      {newMessage.length}/500
                    </div>
                  </div>
                  <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">
                <SendIcon />
              </div>
              <h2>Select a conversation</h2>
              <p>Choose a friend from the sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
