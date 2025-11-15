import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { OXMToast } from "@oxymore/ui";
import { useAuth } from "../../context/AuthContext";
import { privateMessageService } from "../../services/privateMessageService";
import type { Conversation, PrivateMessage, PrivateMessageWebSocket } from "../../types/privateMessage";
import { friendService } from "../../services/friendService";
import type { FriendWithUser } from "../../types/friend";
import type { Message } from "../../types/message";
import { usePrivateMessageSocket } from "../../hooks/usePrivateMessageSocket";
import { usePresenceSocket } from "../../hooks/usePresenceSocket";
import MessagesSidebar from "./MessagesSidebar/MessagesSidebar";
import ChatHeader from "./ChatHeader/ChatHeader";
import MessagesList from "./MessagesList/MessagesList";
import MessageInput from "./MessageInput/MessageInput";
import ScrollToBottomButton from "./ScrollToBottomButton/ScrollToBottomButton";
import NoChatSelected from "./EmptyStates/NoChatSelected";
import "./Messages.scss";

const Messages = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [hoveredOtherMessageId, setHoveredOtherMessageId] = useState<string | null>(null);
  const [openedOtherMenuId, setOpenedOtherMenuId] = useState<string | null>(null);
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const isInitialLoadRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const transformPrivateMessageToMessage = (msg: PrivateMessage | PrivateMessageWebSocket | Partial<PrivateMessage> & Partial<PrivateMessageWebSocket>, currentUserId: string, currentUsername?: string): Message => {
    const isPrivateMessage = 'id_private_message' in msg && msg.id_private_message !== undefined;
    const privateMsg = msg as PrivateMessage;
    const wsMsg = msg as PrivateMessageWebSocket;
    const sentDate = new Date(isPrivateMessage ? (privateMsg.sent_at || '') : (wsMsg.created_at || ''));
    const senderUsername = isPrivateMessage ? privateMsg.sender_username : wsMsg.username;
    const senderAvatar = isPrivateMessage ? privateMsg.sender_avatar_url : wsMsg.avatar_url;
    const messageId = isPrivateMessage ? (privateMsg.id_private_message?.toString() || '') : (wsMsg.id_message || '');
    return {
      id: messageId,
      sender: msg.sender_id === currentUserId ? "You" : (senderUsername || "Unknown"),
      senderAvatar: senderAvatar || '',
      senderUsernameForAvatar: msg.sender_id === currentUserId ? (currentUsername || user?.username || "You") : (senderUsername || "Unknown"),
      timestamp: sentDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      }),
      text: msg.content || '',
      isFromMe: msg.sender_id === currentUserId,
      isAdmin: false,
      replyTo: msg.reply_to ? {
        id: msg.reply_to,
        sender: msg.reply_sender_id === currentUserId ? "You" : (msg.reply_username || "Unknown"),
        text: msg.reply_content || ""
      } : undefined,
    };
  };

  const { sendMessage: sendWebSocketMessage, editMessage: editWebSocketMessage, deleteMessage: deleteWebSocketMessage, isConnected: isWebSocketConnected } = usePrivateMessageSocket({
    friendId: activeChat || null,
    onMessage: (wsMessage) => {
      if (!currentUserId) return;
      const newMessage = transformPrivateMessageToMessage({
        id_private_message: wsMessage.id_message,
        content: wsMessage.content,
        sent_at: wsMessage.created_at,
        sender_id: wsMessage.sender_id,
        sender_username: wsMessage.username,
        sender_avatar_url: wsMessage.avatar_url,
        reply_to: wsMessage.reply_to,
        reply_content: wsMessage.reply_content,
        reply_username: wsMessage.reply_username,
        reply_sender_id: wsMessage.reply_sender_id,
      }, currentUserId, user?.username);

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

      if (newMessage.replyTo) {
        setTimeout(() => {
          const replyElement = messageRefs.current[newMessage.replyTo!.id];
          if (replyElement) {
            scrollToMessageAndHighlight(newMessage.replyTo!.id, replyElement);
          }
        }, 200);
      } else if (shouldAutoScroll) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }

      if (wsMessage.sender_id !== currentUserId) {
        setConversations(prev => {
          const existingConv = prev.find(conv => conv.other_user_id === wsMessage.sender_id);
          if (existingConv) {
            const updated = prev.map(conv =>
              conv.other_user_id === wsMessage.sender_id
                ? {
                    ...conv,
                    unread_count: activeChat === wsMessage.sender_id ? 0 : (conv.unread_count || 0) + 1,
                    last_message: {
                      id_private_message: wsMessage.id_message,
                      content: wsMessage.content,
                      sender_id: wsMessage.sender_id,
                      receiver_id: wsMessage.receiver_id,
                      sent_at: wsMessage.created_at,
                      is_read: false
                    }
                  }
                : conv
            );
            return updated.sort((a, b) => {
              const dateA = a.last_message ? new Date(a.last_message.sent_at).getTime() : 0;
              const dateB = b.last_message ? new Date(b.last_message.sent_at).getTime() : 0;
              return dateB - dateA;
            });
          } else {
            const newConv: Conversation = {
              other_user_id: wsMessage.sender_id,
              other_username: wsMessage.username || "Unknown",
              other_avatar_url: wsMessage.avatar_url,
              other_online_status: 'offline',
              unread_count: activeChat === wsMessage.sender_id ? 0 : 1,
              last_message: {
                id_private_message: wsMessage.id_message,
                content: wsMessage.content,
                sender_id: wsMessage.sender_id,
                receiver_id: wsMessage.receiver_id,
                sent_at: wsMessage.created_at,
                is_read: false
              }
            };
            const updated = [newConv, ...prev];
            const sorted = updated.sort((a, b) => {
              const dateA = a.last_message ? new Date(a.last_message.sent_at).getTime() : 0;
              const dateB = b.last_message ? new Date(b.last_message.sent_at).getTime() : 0;
              return dateB - dateA;
            });
            
            setTimeout(() => {
              loadConversations(true);
            }, 0);
            
            return sorted;
          }
        });
      } else {
        setConversations(prev => {
          const existingConv = prev.find(conv => conv.other_user_id === wsMessage.receiver_id);
          if (existingConv) {
            const updated = prev.map(conv =>
              conv.other_user_id === wsMessage.receiver_id
                ? {
                    ...conv,
                    last_message: {
                      id_private_message: wsMessage.id_message,
                      content: wsMessage.content,
                      sender_id: wsMessage.sender_id,
                      receiver_id: wsMessage.receiver_id,
                      sent_at: wsMessage.created_at,
                      is_read: false
                    }
                  }
                : conv
            );
            return updated.sort((a, b) => {
              const dateA = a.last_message ? new Date(a.last_message.sent_at).getTime() : 0;
              const dateB = b.last_message ? new Date(b.last_message.sent_at).getTime() : 0;
              return dateB - dateA;
            });
          } else {
            loadConversations();
            return prev;
          }
        });
      }
    },
    onMessageEdited: (wsMessage) => {
      if (!currentUserId) return;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === wsMessage.id_message
            ? transformPrivateMessageToMessage({
                id_private_message: wsMessage.id_message,
                content: wsMessage.content,
                sent_at: wsMessage.created_at,
                sender_id: wsMessage.sender_id,
                sender_username: wsMessage.username,
                sender_avatar_url: wsMessage.avatar_url,
                reply_to: wsMessage.reply_to,
                reply_content: wsMessage.reply_content,
                reply_username: wsMessage.reply_username,
                reply_sender_id: wsMessage.reply_sender_id,
              }, currentUserId, user?.username)
            : msg
        )
      );
      
      setTimeout(() => {
        const messageElement = messageRefs.current[wsMessage.id_message];
        if (messageElement) {
          scrollToMessageAndHighlight(wsMessage.id_message, messageElement);
        }
      }, 100);
    },
    onMessageDeleted: (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
    },
    onError: (error) => {
      setToast({ message: error, type: "error" });
    }
  });

  useEffect(() => {
    const userStr = localStorage.getItem("useroxm");
    const user = userStr ? JSON.parse(userStr) : null;
    if (user) {
      setCurrentUserId(user.id_user);
    }
  }, []);

  useEffect(() => {
    const friendId = searchParams.get('friend');
    if (friendId) {
      setActiveChat(friendId);
      setHasInitiallyScrolled(false);
    } else {
      setActiveChat(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user?.id_user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeChat) {
      setMessages([]);
      setHasInitiallyScrolled(false);
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    const friendId = searchParams.get('friend');
    if (friendId && user?.id_user && friendId !== activeChat) {
      loadConversations(true);
    }
  }, [searchParams.get('friend')]);

  useEffect(() => {
    if (!hasInitiallyScrolled && messages.length > 0 && chatMessagesRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        setHasInitiallyScrolled(true);
      }, 100);
    }
  }, [messages, activeChat, hasInitiallyScrolled]);

  useEffect(() => {
    if (hasInitiallyScrolled && chatMessagesRef.current) {
      const handleScroll = () => {
        if (chatMessagesRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
          setShowScrollToBottom(!isAtBottom);
          setShouldAutoScroll(isAtBottom);
        }
      };

      chatMessagesRef.current.addEventListener('scroll', handleScroll);
      return () => {
        chatMessagesRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasInitiallyScrolled, messages.length]);

  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, shouldAutoScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openedMenuId && !target.closest('.message-menu-btn-wrapper') && !target.closest('.message-menu-dropdown')) {
        setOpenedMenuId(null);
      }
      if (openedOtherMenuId && !target.closest('.message-menu-btn-wrapper') && !target.closest('.message-menu-dropdown')) {
        setOpenedOtherMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openedMenuId, openedOtherMenuId]);

  usePresenceSocket({
    onUserOnline: (data) => {
      setConversations(prev =>
        prev.map(conv =>
          conv.other_user_id === data.user_id
            ? { ...conv, other_online_status: 'online' }
            : conv
        )
      );
    },
    onUserOffline: (data) => {
      setConversations(prev =>
        prev.map(conv =>
          conv.other_user_id === data.user_id
            ? { ...conv, other_online_status: 'offline' }
            : conv
        )
      );
    }
  });

  const loadConversations = async (preserveActiveChat: boolean = false) => {
    const friendIdFromUrl = searchParams.get('friend');
    const currentActiveChat = activeChat;
    
    try {
      const convs = await privateMessageService.getConversations();
      
      try {
        const friends = await friendService.getAllFriends(user?.id_user || '');
        const friendsMap = new Map(friends.map((f: FriendWithUser) => [f.user_id, f]));
        
        const correctedConvs = convs.map(conv => {
          const friend = friendsMap.get(conv.other_user_id);
          if (friend) {
            return {
              ...conv,
              other_username: friend.username,
              other_display_name: friend.display_name,
              other_avatar_url: friend.avatar_url || conv.other_avatar_url,
              other_online_status: friend.online_status || conv.other_online_status
            };
          }
          return conv;
        });
        
        let finalConvs = correctedConvs;
        
        if (friendIdFromUrl && !correctedConvs.find(c => c.other_user_id === friendIdFromUrl)) {
          const friendFromUrl = friendsMap.get(friendIdFromUrl);
          if (friendFromUrl) {
            const newConv: Conversation = {
              other_user_id: friendFromUrl.user_id,
              other_username: friendFromUrl.username,
              other_display_name: friendFromUrl.display_name,
              other_avatar_url: friendFromUrl.avatar_url,
              other_online_status: friendFromUrl.online_status,
              unread_count: 0
            };
            finalConvs = [newConv, ...correctedConvs];
          }
        }
        
        setConversations(finalConvs);
        
        if (!preserveActiveChat) {
          if (friendIdFromUrl && friendIdFromUrl !== currentActiveChat) {
            setActiveChat(friendIdFromUrl);
          } else if (finalConvs.length > 0 && !currentActiveChat && !friendIdFromUrl) {
            const firstConversation = finalConvs[0];
            if (firstConversation) {
              setSearchParams({ friend: firstConversation.other_user_id });
              setActiveChat(firstConversation.other_user_id);
            }
          }
        }
      } catch (err) {
        setConversations(convs);
        if (!preserveActiveChat && friendIdFromUrl && friendIdFromUrl !== currentActiveChat) {
          setActiveChat(friendIdFromUrl);
        }
      }
    } catch (error) {
      try {
        const friends = await friendService.getAllFriends(user?.id_user || '');
        const convs: Conversation[] = friends.map((friend: FriendWithUser) => ({
          other_user_id: friend.user_id,
          other_username: friend.username,
          other_display_name: friend.display_name,
          other_avatar_url: friend.avatar_url,
          other_online_status: friend.online_status,
          unread_count: 0
        }));
        setConversations(convs);
        
        if (!preserveActiveChat) {
          if (friendIdFromUrl && friendIdFromUrl !== currentActiveChat) {
            setActiveChat(friendIdFromUrl);
          } else if (convs.length > 0 && !currentActiveChat && !friendIdFromUrl) {
            const firstConversation = convs[0];
            if (firstConversation) {
              setSearchParams({ friend: firstConversation.other_user_id });
              setActiveChat(firstConversation.other_user_id);
            }
          }
        }
      } catch (fallbackError) {
      }
    }
  };

  const loadMessages = async () => {
    if (!activeChat || !currentUserId) return;

    try {
      const messagesData = await privateMessageService.getMessages(activeChat);
      const sortedMessages = [...messagesData].sort((a, b) => {
        const dateA = new Date(a.sent_at).getTime();
        const dateB = new Date(b.sent_at).getTime();
        return dateA - dateB;
      });

      const transformedMessages: Message[] = sortedMessages.map((msg: PrivateMessage) =>
        transformPrivateMessageToMessage(msg, currentUserId, user?.username)
      );

      setMessages(transformedMessages);
      setHasInitiallyScrolled(false);
      isInitialLoadRef.current = true;
      
      setConversations(prev =>
        prev.map(conv =>
          conv.other_user_id === activeChat
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedText = newMessageText.trim().replace(/\n{3,}/g, '\n\n');

    if (!cleanedText || !activeChat || !currentUserId || isSending) {
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
          await privateMessageService.updateMessage(editingMessageId, cleanedText);
          setMessages(prev =>
            prev.map(msg =>
              msg.id === editingMessageId ? { ...msg, text: cleanedText } : msg
            )
          );
        }
        setEditingMessageId(null);
        setToast({ message: "Message modifié", type: "success" });
        
        setTimeout(() => {
          const messageElement = messageRefs.current[editingMessageId];
          if (messageElement) {
            scrollToMessageAndHighlight(editingMessageId, messageElement);
          }
        }, 100);
      } else {
        if (isWebSocketConnected) {
          sendWebSocketMessage(cleanedText, replyingToMessageId || undefined);
          const repliedMessage = replyingToMessageId ? messages.find(m => m.id === replyingToMessageId) : undefined;
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
            replyTo: repliedMessage ? {
              id: repliedMessage.id,
              sender: repliedMessage.sender,
              text: repliedMessage.text
            } : undefined
          };
          setMessages(prev => [...prev, optimisticMessage]);
          
          const now = new Date().toISOString();
          setConversations(prev => {
            const updated = prev.map(conv =>
              conv.other_user_id === activeChat
                ? {
                    ...conv,
                    last_message: {
                      id_private_message: optimisticMessage.id,
                      content: cleanedText,
                      sender_id: currentUserId,
                      receiver_id: activeChat,
                      sent_at: now,
                      is_read: false
                    }
                  }
                : conv
            );
            return updated.sort((a, b) => {
              const dateA = a.last_message ? new Date(a.last_message.sent_at).getTime() : 0;
              const dateB = b.last_message ? new Date(b.last_message.sent_at).getTime() : 0;
              return dateB - dateA;
            });
          });
          
          if (replyingToMessageId) {
            setTimeout(() => {
              const replyElement = messageRefs.current[replyingToMessageId];
              if (replyElement) {
                scrollToMessageAndHighlight(replyingToMessageId, replyElement);
              }
            }, 200);
          }
        } else {
          await privateMessageService.sendMessage(cleanedText, activeChat, replyingToMessageId || undefined);
          await loadMessages();
          
          const now = new Date().toISOString();
          setConversations(prev => {
            const updated = prev.map(conv =>
              conv.other_user_id === activeChat
                ? {
                    ...conv,
                    last_message: {
                      id_private_message: '',
                      content: cleanedText,
                      sender_id: currentUserId,
                      receiver_id: activeChat,
                      sent_at: now,
                      is_read: false
                    }
                  }
                : conv
            );
            return updated.sort((a, b) => {
              const dateA = a.last_message ? new Date(a.last_message.sent_at).getTime() : 0;
              const dateB = b.last_message ? new Date(b.last_message.sent_at).getTime() : 0;
              return dateB - dateA;
            });
          });
          
          if (replyingToMessageId) {
            setTimeout(() => {
              const replyElement = messageRefs.current[replyingToMessageId];
              if (replyElement) {
                scrollToMessageAndHighlight(replyingToMessageId, replyElement);
              }
            }, 200);
          }
        }
      }
      setNewMessageText("");
      setReplyingToMessageId(null);
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
      if (isWebSocketConnected && activeChat) {
        deleteWebSocketMessage(messageId);
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } else {
        await privateMessageService.deleteMessage(messageId);
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
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
    setReplyingToMessageId(null);
    setOpenedMenuId(null);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = currentText.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, 50);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setNewMessageText("");
  };

  const scrollToMessageAndHighlight = (messageId: string, element: HTMLDivElement) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedMessageId(messageId);
    setTimeout(() => {
      setHighlightedMessageId(null);
    }, 2000);
  };

  const handleScrollToBottom = () => {
    setShouldAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMessageToReply = () => {
    if (!replyingToMessageId) return null;
    return messages.find(m => m.id === replyingToMessageId);
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
        return "Offline";
    }
  };

  const handleConversationClick = (userId: string) => {
    setMessages([]);
    setActiveChat(userId);
    setSearchParams({ friend: userId });
    setHasInitiallyScrolled(false);
  };

  const handleMessageMouseEnter = (messageId: string, isFromMe: boolean) => {
    if (isFromMe) {
      setHoveredMessageId(messageId);
    } else {
      setHoveredOtherMessageId(messageId);
    }
  };

  const handleMenuToggle = (messageId: string, isFromMe: boolean) => {
    if (isFromMe) {
      setOpenedMenuId(openedMenuId === messageId ? null : messageId);
    } else {
      setOpenedOtherMenuId(openedOtherMenuId === messageId ? null : messageId);
    }
  };

  const handleReply = (messageId: string) => {
    setReplyingToMessageId(messageId);
    setEditingMessageId(null);
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      scrollToMessageAndHighlight(messageId, messageElement);
    } else {
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
    setOpenedMenuId(null);
    setOpenedOtherMenuId(null);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleReplyClick = (replyId: string) => {
    const replyToElement = messageRefs.current[replyId];
    if (replyToElement) {
      scrollToMessageAndHighlight(replyId, replyToElement);
    } else {
      setHighlightedMessageId(replyId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  const currentConversation = conversations.find(conv => conv.other_user_id === activeChat);

  return (
    <div className="messages-container">
      <div className="messages-layout">
        <MessagesSidebar
          conversations={conversations}
          activeChat={activeChat}
          searchQuery={searchQuery}
          showSearch={showSearch}
          onConversationClick={handleConversationClick}
          onSearchToggle={() => setShowSearch(!showSearch)}
          onSearchChange={setSearchQuery}
          onSearchClose={() => {
            setShowSearch(false);
            setSearchQuery("");
          }}
          getStatusColor={getStatusColor}
        />

        <div className="messages-main">
          {activeChat && currentConversation ? (
            <>
              <ChatHeader
                conversation={currentConversation}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />

              <MessagesList
                messages={messages}
                highlightedMessageId={highlightedMessageId}
                hoveredMessageId={hoveredMessageId}
                hoveredOtherMessageId={hoveredOtherMessageId}
                openedMenuId={openedMenuId}
                openedOtherMenuId={openedOtherMenuId}
                messageRefs={messageRefs}
                chatMessagesRef={chatMessagesRef}
                messagesEndRef={messagesEndRef}
                textareaRef={textareaRef}
                onMessageMouseEnter={handleMessageMouseEnter}
                onMenuToggle={handleMenuToggle}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReplyClick={handleReplyClick}
                scrollToMessageAndHighlight={scrollToMessageAndHighlight}
              />

              {showScrollToBottom && (
                <ScrollToBottomButton onClick={handleScrollToBottom} />
              )}

              <MessageInput
                textareaRef={textareaRef}
                newMessageText={newMessageText}
                editingMessageId={editingMessageId}
                replyingToMessageId={replyingToMessageId}
                isSending={isSending}
                replyingToMessage={getMessageToReply() || null}
                onTextChange={setNewMessageText}
                onSubmit={handleSendMessage}
                onCancelEdit={handleCancelEdit}
                onReplyClose={() => setReplyingToMessageId(null)}
                onReplyClick={() => {
                  const replyElement = messageRefs.current[replyingToMessageId!];
                  if (replyElement) {
                    scrollToMessageAndHighlight(replyingToMessageId!, replyElement);
                  }
                }}
              />
            </>
          ) : (
            <NoChatSelected />
          )}
        </div>
      </div>

      {toast && (
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Messages;
