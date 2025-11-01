import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OXMCheckbox, OXMTooltip, OXMToast } from "@oxymore/ui";
import { MessageSquare, Trash2, Send, Pin } from "lucide-react";
import { teamService } from "../../../../services/teamService";
import { userService } from "../../../../services/userService";
import { avatarService } from "../../../../services/avatarService";
import { truncate } from "../../../../utils/truncate";
import type { Team, TeamChatResponse, PinnedMessageTeam, TeamMemberDetailed, TeamMemberResponse, TeamMember } from "../../../../types/team";
import type { Message } from "../../../../types/message";
import PinnedMessagesModal from "./PinnedMessagesModal/PinnedMessagesModal";
import LeaveTeamModal from "../LeaveTeamModal";
import "./TeamChat.scss";

interface TeamChatProps {
  teamId: string;
  teamData: Team | null;
  onUnreadCountChange?: (count: number) => void;
  isActive?: boolean;
}

const TeamChat: React.FC<TeamChatProps> = ({ teamId, teamData, onUnreadCountChange, isActive = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessageTeam[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberDetailed[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isPinnedMessagesModalOpen, setIsPinnedMessagesModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const [showLeaveTeamModal, setShowLeaveTeamModal] = useState(false);
  const isInitialLoadRef = useRef(true);
  const previousMessagesLengthRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousIsActiveRef = useRef<boolean>(false);
  const navigate = useNavigate();


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chats = await teamService.getTeamChats(teamId);
        const userStr = localStorage.getItem("useroxm");
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
          setCurrentUserId(user.id_user);
          setIsMuted(user.team_chat_is_muted || false);
        }

        const transformedMessages: Message[] = chats.map((chat: TeamChatResponse) => {
          const sentDate = new Date(chat.sent_at);
          // Check if message is from admin: is_admin flag or id_user is null
          const isAdmin = chat.is_admin || chat.id_user === null || chat.id_user === 'admin';
          return {
            id: chat.id_team_chat,
            sender: isAdmin ? "Admin" : (chat.id_user === user?.id_user ? "You" : (chat.username || "Unknown")),
            senderAvatar: isAdmin ? avatarService.getAvatarUrl("Admin") : avatarService.getAvatarUrl(chat.username, chat.avatar_url),
            timestamp: sentDate.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Paris",
            }),
            text: chat.message,
            isFromMe: chat.id_user === user?.id_user && !isAdmin,
            isAdmin: isAdmin,
          };
        });

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

    const interval = setInterval(() => {
      if (teamId) {
        loadMessages();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [teamId, onUnreadCountChange]);

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

    if (isActive && currentUserId && teamId && messages.length > 0) {
      const lastSeenKey = `team_chat_last_seen_${teamId}_${currentUserId}`;
      localStorage.setItem(lastSeenKey, new Date().toISOString());
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

    const chatMessages = chatMessagesRef.current;
    if (chatMessages) {
      handleScroll();
      chatMessages.addEventListener('scroll', handleScroll);
      return () => {
        chatMessages.removeEventListener('scroll', handleScroll);
      };
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openedMenuId && !(event.target as HTMLElement).closest('.message-menu-btn-wrapper')) {
        setOpenedMenuId(null);
        setHoveredMessageId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openedMenuId]);

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

    if (!cleanedText || !currentUserId || isSending) return;

    setIsSending(true);
    setShouldAutoScroll(true);

    try {
      if (editingMessageId) {
        await teamService.updateTeamChat(editingMessageId, cleanedText);
        const updatedMessages = messages.map(msg =>
          msg.id === editingMessageId ? { ...msg, text: cleanedText } : msg
        );
        setMessages(updatedMessages);
        setEditingMessageId(null);
        setToast({ message: "Message modifié", type: "success" });
      } else {
        await teamService.createTeamChat(cleanedText, teamId, currentUserId);
        const chats = await teamService.getTeamChats(teamId);
        const transformedMessages: Message[] = chats.map((chat: TeamChatResponse) => {
          const sentDate = new Date(chat.sent_at);
          return {
            id: chat.id_team_chat,
            sender: chat.id_user === currentUserId ? "You" : (chat.username || "Unknown"),
            senderAvatar: avatarService.getAvatarUrl(chat.username, chat.avatar_url),
            timestamp: sentDate.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Paris",
            }),
            text: chat.message,
            isFromMe: chat.id_user === currentUserId,
          };
        });
        setMessages(transformedMessages);
        setShouldAutoScroll(true);
        setTimeout(() => {
          if (messagesEndRef.current && chatMessagesRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
      setNewMessageText("");
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
      await teamService.deleteTeamChat(messageId);
      const chats = await teamService.getTeamChats(teamId);

      const transformedMessages: Message[] = chats.map((chat: TeamChatResponse) => {
        const sentDate = new Date(chat.sent_at);
        return {
          id: chat.id_team_chat,
          sender: chat.id_user === currentUserId ? "You" : (chat.username || "Unknown"),
          senderAvatar:
            chat.avatar_url ||
            `https://ui-avatars.com/api/?name=${chat.username}&background=random`,
          timestamp: sentDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Paris",
          }),
          text: chat.message,
          isFromMe: chat.id_user === currentUserId,
        };
      });

      setMessages(transformedMessages);
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

  const handlePinnedMessageClick = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 1000);
    }
  };

  const handleScrollToBottom = () => {
    setShouldAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-item">
                <img src={avatarService.getAvatarUrl(member.username, member.avatar)} alt={member.username} />
                <div className="member-info">
                  <span className="member-name">{member.username || member.name}</span>
                </div>
                <span className="member-status online">online</span>
              </div>
            ))}
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
                  <img src={message.senderAvatar} alt={message.sender} />
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble" onMouseEnter={() => message.isFromMe && setHoveredMessageId(message.id)}>
                  <div className={`message-text ${pinnedMessages.some(pin => pin.id_team_chat === message.id) ? 'message-text--pinned' : ''} ${message.isAdmin ? 'message-text--admin' : ''}`}>
                    {pinnedMessages.some(pin => pin.id_team_chat === message.id) && (
                      <span className="pinned-icon">
                        <Pin size={14} />
                      </span>
                    )}
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
                          <button className="message-menu-item" onClick={() => handleEdit(message.id, message.text)}>Edit</button>
                          <button className="message-menu-item" onClick={() => handleDelete(message.id)}>Delete</button>
                          <button className="message-menu-item" onClick={() => handlePin(message.id)}>
                            {pinnedMessages.some(pin => pin.id_team_chat === message.id) ? 'Unpin' : 'Pin'}
                          </button>
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
                  <img src={message.senderAvatar} alt={message.sender} />
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

        <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
          <textarea
            placeholder={editingMessageId ? "Edit your message..." : "Type Your Message"}
            className="chat-input"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            rows={1}
            ref={textareaRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                e.preventDefault();
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
          <button type="submit" className="send-button" disabled={isSending || !newMessageText.trim()}>
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
