import { useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import type { PrivateMessageWebSocket, UsePrivateMessageSocketOptions } from '../types/privateMessage';

export const usePrivateMessageSocket = ({
  friendId,
  onMessage,
  onMessageEdited,
  onMessageDeleted,
  onTyping,
  onError
}: UsePrivateMessageSocketOptions) => {
  const { socket, isConnected } = useWebSocket();
  const friendIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !friendId) return;

    if (friendIdRef.current && friendIdRef.current !== friendId) {
      socket.emit('leave_private_chat', { friend_id: friendIdRef.current });
    }

    socket.emit('join_private_chat', { friend_id: friendId });
    friendIdRef.current = friendId;

    return () => {
      if (friendIdRef.current) {
        socket.emit('leave_private_chat', { friend_id: friendIdRef.current });
        friendIdRef.current = null;
      }
    };
  }, [socket, isConnected, friendId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: PrivateMessageWebSocket) => {
      if (onMessage) {
        if (friendId === null) {
          onMessage(message);
        } else if (message.sender_id === friendId || message.receiver_id === friendId) {
          onMessage(message);
        }
      }
    };

    const handleTyping = (data: { user_id: string; username?: string; friend_id: string; is_typing: boolean }) => {
      if (onTyping && data.friend_id === friendId) {
        onTyping({ user_id: data.user_id, username: data.username, is_typing: data.is_typing });
      }
    };

    const handleMessageEdited = (message: PrivateMessageWebSocket) => {
      if (onMessageEdited) {
        if (friendId === null) {
          onMessageEdited(message);
        } else if (message.sender_id === friendId || message.receiver_id === friendId) {
          onMessageEdited(message);
        }
      }
    };

    const handleMessageDeleted = (data: { message_id: string; sender_id: string; receiver_id: string }) => {
      if (onMessageDeleted) {
        if (friendId === null) {
          onMessageDeleted(data);
        } else if (data.sender_id === friendId || data.receiver_id === friendId) {
          onMessageDeleted(data);
        }
      }
    };

    const handleError = (error: { message: string }) => {
      if (onError) {
        onError(error.message);
      }
    };

    socket.on('private_message_received', handleMessage);
    socket.on('private_message_edited', handleMessageEdited);
    socket.on('private_message_deleted', handleMessageDeleted);
    socket.on('user_typing_private', handleTyping);
    socket.on('error', handleError);

    return () => {
      socket.off('private_message_received', handleMessage);
      socket.off('private_message_edited', handleMessageEdited);
      socket.off('private_message_deleted', handleMessageDeleted);
      socket.off('user_typing_private', handleTyping);
      socket.off('error', handleError);
    };
  }, [socket, friendId, onMessage, onMessageEdited, onMessageDeleted, onTyping, onError]);

  const sendMessage = useCallback((message: string, replyTo?: string) => {
    if (!socket || !isConnected || !friendId) return;

    socket.emit('send_private_message', {
      message,
      friend_id: friendId,
      reply_to: replyTo
    });
  }, [socket, isConnected, friendId]);

  const editMessage = useCallback((messageId: string, content: string) => {
    if (!socket || !isConnected || !friendId) return;

    socket.emit('edit_private_message', {
      message_id: messageId,
      content,
      friend_id: friendId
    });
  }, [socket, isConnected, friendId]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!socket || !isConnected || !friendId) return;

    socket.emit('delete_private_message', {
      message_id: messageId,
      friend_id: friendId
    });
  }, [socket, isConnected, friendId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socket || !isConnected || !friendId) return;

    socket.emit('typing_private', {
      friend_id: friendId,
      is_typing: isTyping
    });
  }, [socket, isConnected, friendId]);

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    sendTyping,
    isConnected
  };
};

