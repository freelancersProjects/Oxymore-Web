import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OXMCheckbox, OXMTooltip, OXMToast } from "@oxymore/ui";
import { MessageSquare, Trash2, Send, Pin, X } from "lucide-react";
import { teamService } from "../../../../services/teamService";
import { userService } from "../../../../services/userService";
import Avatar from "../../../../components/Avatar/Avatar";
import { notificationService } from "../../../../services/notificationService";
import { truncate } from "../../../../utils/truncate";
import type { Team, TeamChatResponse, PinnedMessageTeam, TeamMemberDetailed, TeamMemberResponse } from "../../../../types/team";
import type { Message } from "../../../../types/message";
import { useTeamChatSocket } from "../../../../hooks/useTeamChatSocket";
import { usePresenceSocket } from "../../../../hooks/usePresenceSocket";
import PinnedMessagesModal from "./PinnedMessagesModal/PinnedMessagesModal";
import ReportMessageModal from "./ReportMessageModal/ReportMessageModal";
import LeaveTeamModal from "../LeaveTeamModal";
import "./TeamChat.scss";

interface TeamChatProps {
  teamId: string;
  teamData: Team | null;
  onUnreadCountChange?: (count: number) => void;
  isActive?: boolean;
}

interface ChatMessageInput {
  id_team_chat?: string;
  id_message?: string;
  message?: string;
  content?: string;
  sent_at?: string;
  created_at?: string;
  id_user?: string | null;
  username?: string;
  avatar_url?: string;
  is_admin?: boolean;
  reply_to?: string;
  reply_message?: string;
  reply_id_user?: string | null;
  reply_username?: string;
}

const TeamChat: React.FC<TeamChatProps> = ({ teamId, teamData, onUnreadCountChange, isActive = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessageTeam[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberDetailed[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [hoveredOtherMessageId, setHoveredOtherMessageId] = useState<string | null>(null);
  const [openedOtherMenuId, setOpenedOtherMenuId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessageId, setReportMessageId] = useState<string | null>(null);
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isPinnedMessagesModalOpen, setIsPinnedMessagesModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const [showLeaveTeamModal, setShowLeaveTeamModal] = useState(false);
  const [showEmptyMessageHint, setShowEmptyMessageHint] = useState(false);
  const isInitialLoadRef = useRef(true);
  const previousMessagesLengthRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousIsActiveRef = useRef<boolean>(false);
  const navigate = useNavigate();

  const transformChatToMessage = (chat: ChatMessageInput | TeamChatResponse, currentUserId: string, currentUsername?: string): Message => {
    const sentDate = new Date(chat.sent_at || (chat as ChatMessageInput).created_at || '');
    const isAdmin = chat.is_admin || chat.id_user === null || chat.id_user === 'admin';
    const chatInput = chat as ChatMessageInput;
    return {
      id: chat.id_team_chat || chatInput.id_message || '',
      sender: isAdmin ? "Admin" : (chat.id_user === currentUserId ? "You" : (chat.username || "Unknown")),
      senderAvatar: chat.avatar_url || '',
      senderUsernameForAvatar: isAdmin ? "Admin" : (chat.id_user === currentUserId ? (currentUsername || "You") : (chat.username || "Unknown")),
      timestamp: sentDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      }),
      text: chat.message || chatInput.content || '',
      isFromMe: chat.id_user === currentUserId && !isAdmin,
      isAdmin: isAdmin,
      replyTo: chatInput.reply_to && chatInput.reply_message ? {
        id: chatInput.reply_to,
        text: chatInput.reply_message,
        sender: (chatInput.reply_id_user === null || chatInput.reply_id_user === 'admin') ? "Admin" : (chatInput.reply_username || chatInput.reply_id_user || "Unknown")
      } : undefined,
    };
  };

  const { sendMessage: sendWebSocketMessage, editMessage: editWebSocketMessage, deleteMessage: deleteWebSocketMessage, isConnected: isWebSocketConnected } = useTeamChatSocket({
    teamId: teamId || null,
    onMessage: (wsMessage) => {
      if (!currentUserId) return;
      const newMessage = transformChatToMessage({
        id_team_chat: wsMessage.id_message,
        message: wsMessage.content,
        sent_at: wsMessage.created_at,
        id_user: wsMessage.user_id,
        username: wsMessage.username,
        avatar_url: wsMessage.avatar_url,
        is_admin: false
      }, currentUserId, currentUsername);

      setMessages(prev => {
        const exists = prev.some(m => m.id === newMessage.id || (m.id.startsWith('temp-') && m.text === newMessage.text && m.isFromMe));
        if (exists) {
          return prev.map(m => 
            (m.id.startsWith('temp-') && m.text === newMessage.text && m.isFromMe) ? newMessage : m
          );
        }
        return [...prev, newMessage].sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateA - dateB;
        });
      });

      if (shouldAutoScroll) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    },
    onMessageEdited: (wsMessage) => {
      if (!currentUserId) return;
      const newMessage = transformChatToMessage({
        id_team_chat: wsMessage.id_message,
        message: wsMessage.content,
        sent_at: wsMessage.created_at,
        id_user: wsMessage.user_id,
        username: wsMessage.username,
        avatar_url: wsMessage.avatar_url,
        is_admin: false
      }, currentUserId, currentUsername);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === wsMessage.id_message ? newMessage : msg
        )
      );
    },
    onMessageDeleted: (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
    },
    onError: (error) => {
      setToast({ message: error, type: "error" });
    }
  });

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chats = await teamService.getTeamChats(teamId);
        const userStr = localStorage.getItem("useroxm");
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
          setCurrentUserId(user.id_user);
          setCurrentUsername(user.username || "");
          setIsMuted(user.team_chat_is_muted || false);
        }

        const sortedChats = [...chats].sort((a, b) => {
          const dateA = new Date(a.sent_at).getTime();
          const dateB = new Date(b.sent_at).getTime();
          return dateA - dateB;
        });

        const transformedMessages: Message[] = sortedChats.map((chat: TeamChatResponse) => transformChatToMessage(chat, user?.id_user || "", user?.username));

        setMessages(transformedMessages);

        if (isInitialLoadRef.current) {
          setHasInitiallyScrolled(false);
          isInitialLoadRef.current = false;
        }

        if (user && onUnreadCountChange) {
          const lastSeenKey = `team_chat_last_seen_${teamId}_${user.id_user}`;
          const lastSeenTimestamp = localStorage.getItem(lastSeenKey);

          if (lastSeenTimestamp) {
            const lastSeenDate = new Date(lastSeenTimestamp);
            const unreadCount = chats.filter((chat: TeamChatResponse) => {
              const msgDate = new Date(chat.sent_at);
              return chat.id_user !== user.id_user && msgDate > lastSeenDate;
            }).length;
            onUnreadCountChange(unreadCount);
          } else {
            const unreadCount = chats.filter((chat: TeamChatResponse) => {
              return chat.id_user !== user.id_user;
            }).length;
            onUnreadCountChange(unreadCount);
          }
        }
      } catch (error) {
      }
    };

    const loadTeamMembers = async () => {
      try {
        const members = await teamService.getTeamMembersByTeamId(teamId);
        const detailedMembers: TeamMemberDetailed[] = members.map((member: TeamMemberResponse) => ({
          id_user: member.id_user,
          username: member.username || "Unknown",
          name: member.name,
          avatar: member.avatar_url,
          role: member.role,
          online_status: 'offline' as const,
        }));
        setTeamMembers(detailedMembers);
      } catch (error) {
      }
    };

    const loadPinnedMessages = async () => {
      try {
        const pins = await teamService.getPinnedMessages(teamId);
        setPinnedMessages(pins);
      } catch (error) {
      }
    };

    if (teamId) {
      isInitialLoadRef.current = true;
      previousIsActiveRef.current = isActive;
      loadMessages();
      loadTeamMembers();
      loadPinnedMessages();
    }
  }, [teamId, onUnreadCountChange]);

  usePresenceSocket({
    onUserOnline: (data) => {
      setTeamMembers(prevMembers =>
        prevMembers.map(member =>
          member.id_user === data.user_id
            ? { ...member, online_status: 'online' }
            : member
        )
      );
    },
    onUserOffline: (data) => {
      setTeamMembers(prevMembers =>
        prevMembers.map(member =>
          member.id_user === data.user_id
            ? { ...member, online_status: 'offline' }
            : member
        )
      );
    }
  });

  useEffect(() => {
    if (isActive && !previousIsActiveRef.current && messages.length > 0 && chatMessagesRef.current) {
      setTimeout(() => {
        if (chatMessagesRef.current && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          setHasInitiallyScrolled(true);
          setShouldAutoScroll(true);
          previousMessagesLengthRef.current = messages.length;
        }
      }, 100);
    }
    
    previousIsActiveRef.current = isActive;
  }, [isActive, messages.length]);

  useEffect(() => {
    if (!hasInitiallyScrolled && messages.length > 0 && chatMessagesRef.current && isActive) {
      setTimeout(() => {
        if (chatMessagesRef.current && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          setHasInitiallyScrolled(true);
          setShouldAutoScroll(true);
          previousMessagesLengthRef.current = messages.length;
        }
      }, 100);
      return;
    }

    if (hasInitiallyScrolled && chatMessagesRef.current) {
      const hasNewMessages = messages.length > previousMessagesLengthRef.current;
      previousMessagesLengthRef.current = messages.length;

      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isScrolledToBottom = distanceFromBottom < 100;

      if (shouldAutoScroll && isScrolledToBottom && hasNewMessages) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      } else if (!isScrolledToBottom) {
        setShouldAutoScroll(false);
      }
    }

    if (isActive && currentUserId && teamId && messages.length > 0 && teamData?.name) {
      const lastSeenKey = `team_chat_last_seen_${teamId}_${currentUserId}`;
      localStorage.setItem(lastSeenKey, new Date().toISOString());
      
      notificationService.markReplyNotificationsAsReadForTeam(currentUserId, teamData.name).catch(() => {});
      
      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
    }
  }, [messages, currentUserId, teamId, onUnreadCountChange, isActive, shouldAutoScroll, hasInitiallyScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatMessagesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isScrolledToBottom = distanceFromBottom < 100;

        setShowScrollToBottom(!isScrolledToBottom);
        setShouldAutoScroll(isScrolledToBottom);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!chatMessagesRef.current) return;

      const container = chatMessagesRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
        return;
      }

      e.stopPropagation();
    };

    const chatMessages = chatMessagesRef.current;
    if (chatMessages) {
      handleScroll();
      chatMessages.addEventListener('scroll', handleScroll);
      chatMessages.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        chatMessages.removeEventListener('scroll', handleScroll);
        chatMessages.removeEventListener('wheel', handleWheel);
      };
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openedMenuId && !(event.target as HTMLElement).closest('.message-menu-btn-wrapper')) {
        setOpenedMenuId(null);
        setHoveredMessageId(null);
      }
      if (openedOtherMenuId && !(event.target as HTMLElement).closest('.message-menu-btn-wrapper')) {
        setOpenedOtherMenuId(null);
        setHoveredOtherMessageId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openedMenuId, openedOtherMenuId]);

  const handleToggleMute = async (checked: boolean) => {
    const userStr = localStorage.getItem("useroxm");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    setLoading(true);

    try {
      await userService.toggleTeamChatMute(user.id_user, checked);
      setIsMuted(checked);

      const updatedUser = { ...user, team_chat_is_muted: checked };
      localStorage.setItem("useroxm", JSON.stringify(updatedUser));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedText = newMessageText.trim().replace(/\n{3,}/g, '\n\n');

    if (!cleanedText || !currentUserId || isSending) {
      if (!cleanedText) {
        setShowEmptyMessageHint(true);
        setTimeout(() => {
          setShowEmptyMessageHint(false);
        }, 5000);
      }
      return;
    }

    setIsSending(true);
    setShouldAutoScroll(true);

    try {
      if (editingMessageId) {
        if (isWebSocketConnected) {
          editWebSocketMessage(editingMessageId, cleanedText);
          setMessages(prev =>
            prev.map(msg =>
              msg.id === editingMessageId ? { ...msg, text: cleanedText } : msg
            )
          );
        } else {
          await teamService.updateTeamChat(editingMessageId, cleanedText);
          setMessages(prev =>
            prev.map(msg =>
              msg.id === editingMessageId ? { ...msg, text: cleanedText } : msg
            )
          );
        }
        setEditingMessageId(null);
        setToast({ message: "Message modifié", type: "success" });
      } else {
        if (isWebSocketConnected) {
          sendWebSocketMessage(cleanedText, replyingToMessageId || undefined);
          const userStr = localStorage.getItem("useroxm");
          const user = userStr ? JSON.parse(userStr) : null;
          const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            sender: "You",
            senderUsernameForAvatar: user?.username || "You",
            senderAvatar: '',
            timestamp: new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Paris",
            }),
            text: cleanedText,
            isFromMe: true,
            isAdmin: false,
            replyTo: replyingToMessageId ? messages.find(m => m.id === replyingToMessageId)?.replyTo : undefined
          };
          setMessages(prev => [...prev, optimisticMessage]);
        } else {
          await teamService.createTeamChat(cleanedText, teamId, currentUserId, replyingToMessageId || undefined);
          const chats = await teamService.getTeamChats(teamId);
          const sortedChats = [...chats].sort((a, b) => {
            const dateA = new Date(a.sent_at).getTime();
            const dateB = new Date(b.sent_at).getTime();
            return dateA - dateB;
          });
          const transformedMessages: Message[] = sortedChats.map((chat: TeamChatResponse) => transformChatToMessage(chat, currentUserId, currentUsername));
          setMessages(transformedMessages);
        }
        setShouldAutoScroll(true);
        setTimeout(() => {
          if (messagesEndRef.current && chatMessagesRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
      setNewMessageText("");
      setReplyingToMessageId(null);
      // Refocus input after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } catch (error) {
      setToast({ message: "Erreur lors de l'envoi", type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      if (isWebSocketConnected) {
        deleteWebSocketMessage(messageId);
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } else {
        await teamService.deleteTeamChat(messageId);
        const chats = await teamService.getTeamChats(teamId);

        const sortedChats = [...chats].sort((a, b) => {
          const dateA = new Date(a.sent_at).getTime();
          const dateB = new Date(b.sent_at).getTime();
          return dateA - dateB;
        });

        const transformedMessages: Message[] = sortedChats.map((chat: TeamChatResponse) => transformChatToMessage(chat, currentUserId, currentUsername));
        setMessages(transformedMessages);
      }
      setOpenedMenuId(null);
      setToast({ message: "Message supprimé", type: "success" });
    } catch (error) {
      setToast({ message: "Erreur lors de la suppression", type: "error" });
    }
  };

  const handleEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setNewMessageText(currentText);
    setOpenedMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setNewMessageText("");
  };

  const handlePin = async (messageId: string) => {
    const isPinned = pinnedMessages.some(pin => pin.id_team_chat === messageId);

    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      scrollToMessageAndHighlight(messageId, messageElement);
    } else {
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }

    if (isPinned) {
      const pin = pinnedMessages.find(pin => pin.id_team_chat === messageId);
      if (pin) {
        try {
          await teamService.unpinMessage(pin.id_pinned_message_team);
          const updatedPins = pinnedMessages.filter(pin => pin.id_team_chat !== messageId);
          setPinnedMessages(updatedPins);
          setToast({ message: "Message désépinglé", type: "info" });
        } catch (error) {
          setToast({ message: "Erreur lors du désépinglage", type: "error" });
        }
      }
    } else {
      try {
        await teamService.pinMessage(teamId, messageId, currentUserId);
        const updatedPins = await teamService.getPinnedMessages(teamId);
        setPinnedMessages(updatedPins);
        setToast({ message: "Message épinglé", type: "success" });
      } catch (error) {
        setToast({ message: "Erreur lors de l'épinglage", type: "error" });
      }
    }
    setOpenedMenuId(null);
  };

  const handleUnpinMessage = async (pinId: string) => {
    try {
      await teamService.unpinMessage(pinId);
      const updatedPins = pinnedMessages.filter(pin => pin.id_pinned_message_team !== pinId);
      setPinnedMessages(updatedPins);
      setToast({ message: "Message désépinglé", type: "info" });
    } catch (error) {
      setToast({ message: "Erreur lors du désépinglage", type: "error" });
    }
  };

  const scrollToMessageAndHighlight = (messageId: string, element: HTMLElement | null) => {
    if (!element) return;

    const scrollContainer = element.closest('.chat-messages') || element.parentElement;
    if (!scrollContainer) return;

    const startScrollTop = scrollContainer.scrollTop;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    let lastScrollTop = startScrollTop;
    let scrollEndTimeout: NodeJS.Timeout | null = null;

    const checkScrollEnd = () => {
      const currentScrollTop = scrollContainer.scrollTop;
      
      if (Math.abs(currentScrollTop - lastScrollTop) < 1) {
        if (scrollEndTimeout) {
          clearTimeout(scrollEndTimeout);
        }
        scrollEndTimeout = setTimeout(() => {
          setHighlightedMessageId(messageId);
          setTimeout(() => {
            setHighlightedMessageId(null);
          }, 2000);
          scrollContainer.removeEventListener('scroll', checkScrollEnd);
        }, 100);
      } else {
        lastScrollTop = currentScrollTop;
      }
    };

    scrollContainer.addEventListener('scroll', checkScrollEnd);
    
    setTimeout(() => {
      scrollContainer.removeEventListener('scroll', checkScrollEnd);
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }, 1000);
  };

  const handlePinnedMessageClick = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      scrollToMessageAndHighlight(messageId, messageElement);
    }
  };

  const handleScrollToBottom = () => {
    setShouldAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReportMessage = async (reasons: string[]) => {
    if (!reportMessageId || !currentUserId) return;
    
    try {
      const reasonText = reasons.join(', ');
      await teamService.reportTeamChat(reportMessageId, currentUserId, reasonText);
      setToast({ message: "Message signalé", type: "success" });
      setShowReportModal(false);
      setReportMessageId(null);
    } catch (error) {
      setToast({ message: "Erreur lors du signalement", type: "error" });
    }
  };

  const getMessageToReply = () => {
    if (!replyingToMessageId) return null;
    return messages.find(m => m.id === replyingToMessageId);
  };

  const currentUserMember = teamMembers.find(m => m.id_user === currentUserId);
  const isAdmin = currentUserMember?.role === 'captain' || currentUserMember?.role === 'admin';

  const canDeletePin = (pin: PinnedMessageTeam): boolean => {
    if (isAdmin) return true;
    return pin.id_user === currentUserId;
  };

  return (
    <div className={`chat-wrapper ${!isActive ? 'hidden' : ''}`}>
      <div className="team-chat-sidebar">
        <div className="sidebar-box">
          <h4>Team Members ({teamMembers.length})</h4>
          <div className="team-members-list">
            {teamMembers.map((member, index) => {
              const status = member.online_status || 'offline';
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
                    return "Offline";
                }
              };
              return (
                <div key={index} className="team-member-item">
                  <div className="member-avatar-wrapper">
                    <Avatar
                      username={member.username}
                      avatarUrl={member.avatar}
                      size={32}
                      className="avatar-image"
                    />
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(status) }}
                    />
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.username || member.name}</span>
                  </div>
                  <span 
                    className={`member-status ${status}`}
                    style={{ color: getStatusColor(status) }}
                  >
                    {getStatusText(status)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sidebar-box">
          <div className="sidebar-box-header">
            <h4>Pinned Messages ({pinnedMessages.length})</h4>
            <button
              className="pinned-messages-open-btn"
              onClick={() => setIsPinnedMessagesModalOpen(true)}
              title="View all pinned messages"
            >
              <Pin size={16} />
            </button>
          </div>
          {pinnedMessages.length > 0 ? (
            <div className="pinned-messages-list">
              {pinnedMessages.map((pin, index) => (
                <div key={index} className="pinned-message-item" onClick={() => handlePinnedMessageClick(pin.id_team_chat)}>
                  <div className="pinned-message-content">
                    <div className="pinned-message-text">{truncate(pin.message || "", 50)}</div>
                    <div className="pinned-message-sender">{pin.username}</div>
                  </div>
                  {canDeletePin(pin) && (
                    <button
                      className="pinned-message-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnpinMessage(pin.id_pinned_message_team);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-pinned">No Pinned Messages</p>
          )}
        </div>

        <div className="sidebar-box">
          <h4>Chat Settings</h4>
          <div className="settings-options">
            {/* @ts-ignore */}
            <OXMCheckbox
              checked={isMuted}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleToggleMute(e.target.checked)
              }
              disabled={loading}
              theme="purple"
              size="medium"
              label="Notifications silencieuses"
            />
            {teamData?.name && truncate(teamData.name, 15) !== teamData.name ? (
              /* @ts-ignore */
              <OXMTooltip text={teamData.name} position="top" delay={200}>
                <button className="leave-team-btn" onClick={() => setShowLeaveTeamModal(true)}>
                  Leave Team "{truncate(teamData.name, 15)}"
                </button>
              </OXMTooltip>
            ) : (
              <button className="leave-team-btn" onClick={() => setShowLeaveTeamModal(true)}>
                Leave Team "{truncate(teamData?.name || "", 15)}"
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="team-chat-main">
        <h2 className="team-chat-title">Team Chat</h2>
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.length === 0 ? (
            <div className="empty-chat">
              <MessageSquare className="empty-chat-icon" />
              <div className="empty-chat-text">Commencez à chatter</div>
            </div>
          ) : (
            messages.map((message) => (
            <div
              key={message.id}
              ref={(el) => (messageRefs.current[message.id] = el)}
              className={`message ${
                message.isFromMe ? "message--me" : "message--other"
              } ${highlightedMessageId === message.id ? 'message--highlighted' : ''}`}
            >
              {!message.isFromMe && (
                <div className="message-avatar">
                  <Avatar
                    username={message.senderUsernameForAvatar || message.sender}
                    avatarUrl={message.senderAvatar}
                    size={36}
                    className="avatar-image"
                  />
                </div>
              )}
              <div className="message-content">
                {message.replyTo && (
                  <div 
                    className="message-reply-preview"
                    onClick={() => {
                      const replyElement = messageRefs.current[message.replyTo!.id];
                      if (replyElement) {
                        scrollToMessageAndHighlight(message.replyTo!.id, replyElement);
                      }
                    }}
                  >
                    <div className="message-reply-preview-info">
                      <span className="message-reply-preview-label">↳ Répondre à</span>
                      <span className="message-reply-preview-sender">{message.replyTo.sender}</span>
                    </div>
                    <div className="message-reply-preview-text">"{truncate(message.replyTo.text, 50)}"</div>
                  </div>
                )}
                <div className="message-bubble" onMouseEnter={() => {
                  if (message.isFromMe) {
                    setHoveredMessageId(message.id);
                  } else {
                    setHoveredOtherMessageId(message.id);
                  }
                }}>
                  <div className={`message-text ${pinnedMessages.some(pin => pin.id_team_chat === message.id) ? 'message-text--pinned' : ''} ${message.isAdmin ? 'message-text--admin' : ''}`}>
                    <span style={{ whiteSpace: 'pre-wrap', color: message.isAdmin ? '#ef4444' : 'inherit' }}>{message.text}</span>
                  </div>
                  {hoveredMessageId === message.id && message.isFromMe && (
                    <div
                      className="message-menu-btn-wrapper"
                      onMouseEnter={() => setHoveredMessageId(message.id)}
                    >
                      <button
                        className="message-menu-btn"
                        onClick={() => setOpenedMenuId(openedMenuId === message.id ? null : message.id)}
                      >⋯</button>
                      {openedMenuId === message.id && (
                        <div className={`message-menu-dropdown ${message.id === messages[0]?.id ? 'message-menu-dropdown--bottom' : ''} ${message.id === messages[messages.length - 1]?.id ? 'message-menu-dropdown--top' : ''}`}>
                          <button className="message-menu-item" onClick={() => {
                            setReplyingToMessageId(message.id);
                            const messageElement = messageRefs.current[message.id];
                            if (messageElement) {
                              scrollToMessageAndHighlight(message.id, messageElement);
                            } else {
                              setHighlightedMessageId(message.id);
                              setTimeout(() => {
                                setHighlightedMessageId(null);
                              }, 2000);
                            }
                            setOpenedMenuId(null);
                          }}>Répondre</button>
                          <button className="message-menu-item" onClick={() => handleEdit(message.id, message.text)}>Edit</button>
                          <button className="message-menu-item" onClick={() => handleDelete(message.id)}>Delete</button>
                          <button className="message-menu-item" onClick={() => handlePin(message.id)}>
                            {pinnedMessages.some(pin => pin.id_team_chat === message.id) ? 'Unpin' : 'Pin'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {hoveredOtherMessageId === message.id && !message.isFromMe && (
                    <div
                      className="message-menu-btn-wrapper"
                      onMouseEnter={() => setHoveredOtherMessageId(message.id)}
                    >
                      <button
                        className="message-menu-btn"
                        onClick={() => setOpenedOtherMenuId(openedOtherMenuId === message.id ? null : message.id)}
                      >⋯</button>
                      {openedOtherMenuId === message.id && (
                        <div className={`message-menu-dropdown ${message.id === messages[0]?.id ? 'message-menu-dropdown--bottom' : ''} ${message.id === messages[messages.length - 1]?.id ? 'message-menu-dropdown--top' : ''}`}>
                          <button className="message-menu-item" onClick={() => {
                            setReplyingToMessageId(message.id);
                            const messageElement = messageRefs.current[message.id];
                            if (messageElement) {
                              scrollToMessageAndHighlight(message.id, messageElement);
                            } else {
                              setHighlightedMessageId(message.id);
                              setTimeout(() => {
                                setHighlightedMessageId(null);
                              }, 2000);
                            }
                            setOpenedOtherMenuId(null);
                          }}>Répondre</button>
                          <button className="message-menu-item message-menu-item--danger" onClick={() => {
                            setReportMessageId(message.id);
                            setShowReportModal(true);
                            setOpenedOtherMenuId(null);
                          }}>Reporter</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="message-footer">
                  <span className={`message-sender ${message.isAdmin ? 'message-sender--admin' : ''}`} style={{ color: message.isAdmin ? '#ef4444' : 'inherit' }}>{message.sender}</span>
                  <span className={`message-time ${message.isAdmin ? 'message-time--admin' : ''}`}>{message.timestamp}</span>
                </div>
              </div>
              {message.isFromMe && (
                <div className="message-avatar">
                  <Avatar
                    username={message.senderUsernameForAvatar || message.sender}
                    avatarUrl={message.senderAvatar}
                    size={36}
                    className="avatar-image"
                  />
                </div>
              )}
            </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {showScrollToBottom && (
          <button className="scroll-to-bottom-btn" onClick={handleScrollToBottom}>
            Voir les derniers messages
          </button>
        )}

        {replyingToMessageId && (
          <div 
            className="reply-preview"
            onClick={() => {
              const replyElement = messageRefs.current[replyingToMessageId];
              if (replyElement) {
                scrollToMessageAndHighlight(replyingToMessageId, replyElement);
              }
            }}
          >
            <div className="reply-preview-content">
              <div className="reply-preview-info">
                <span className="reply-preview-label">Répondre à</span>
                <span className="reply-preview-sender">{getMessageToReply()?.sender}</span>
              </div>
              <div className="reply-preview-text">{truncate(getMessageToReply()?.text || '', 50)}</div>
            </div>
            <button
              className="reply-preview-close"
              onClick={(e) => {
                e.stopPropagation();
                setReplyingToMessageId(null);
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {showEmptyMessageHint && (
          <div className="chat-input-hint">
            <p>Votre message est vide. Veuillez saisir votre message avant d'envoyer.</p>
          </div>
        )}
        <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
          <textarea
            placeholder={editingMessageId ? "Edit your message..." : replyingToMessageId ? "Répondre..." : "Type Your Message"}
            className="chat-input"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            rows={1}
            ref={textareaRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                e.preventDefault();
                if (!newMessageText.trim()) {
                  setShowEmptyMessageHint(true);
                  setTimeout(() => {
                    setShowEmptyMessageHint(false);
                  }, 5000);
                  return;
                }
                const syntheticEvent = {
                  ...e,
                  preventDefault: () => e.preventDefault(),
                  stopPropagation: () => e.stopPropagation(),
                } as unknown as React.FormEvent;
                handleSendMessage(syntheticEvent);
              }
            }}
            disabled={isSending}
          />
          {editingMessageId && (
            <button type="button" className="cancel-edit-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="send-button" 
            disabled={isSending}
            onClick={(e) => {
              if (!newMessageText.trim()) {
                e.preventDefault();
                setShowEmptyMessageHint(true);
                setTimeout(() => {
                  setShowEmptyMessageHint(false);
                }, 5000);
              }
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      {toast && (
        /* @ts-ignore */
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <PinnedMessagesModal
        isOpen={isPinnedMessagesModalOpen}
        onClose={() => setIsPinnedMessagesModalOpen(false)}
        pinnedMessages={pinnedMessages}
        onUnpin={handleUnpinMessage}
        onMessageClick={(messageId) => {
          setIsPinnedMessagesModalOpen(false);
          handlePinnedMessageClick(messageId);
        }}
        currentUserId={currentUserId}
        teamMembers={teamMembers}
      />

      {reportMessageId && (
        <ReportMessageModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportMessageId(null);
          }}
          onReport={handleReportMessage}
          messageText={messages.find(m => m.id === reportMessageId)?.text}
          senderName={messages.find(m => m.id === reportMessageId)?.sender}
        />
      )}

      {teamData && currentUserId && (
        <LeaveTeamModal
          isOpen={showLeaveTeamModal}
          onClose={() => setShowLeaveTeamModal(false)}
          onConfirm={async () => {
            await teamService.leaveTeam(teamId, currentUserId);
            setToast({ message: "Vous avez quitté l'équipe", type: "success" });
            setTimeout(() => {
              navigate('/teams');
            }, 1000);
          }}
          teamName={teamData.name}
          isCapturing={teamMembers.find(m => m.id_user === currentUserId)?.role === 'captain'}
        />
      )}
    </div>
  );
};

export default TeamChat;
