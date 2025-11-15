import { useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useWebSocket } from '../contexts/WebSocketContext';

interface TeamMessage {
  id_message: string;
  content: string;
  created_at: string;
  user_id: string;
  channel_id: string;
  is_from_ai: boolean;
  username?: string;
  avatar_url?: string;
}

interface UseTeamChatSocketOptions {
  teamId: string | null;
  onMessage?: (message: TeamMessage) => void;
  onMessageEdited?: (message: TeamMessage) => void;
  onMessageDeleted?: (data: { message_id: string; user_id: string; team_id: string }) => void;
  onTyping?: (data: { user_id: string; username?: string; is_typing: boolean }) => void;
  onError?: (error: string) => void;
}

export const useTeamChatSocket = ({
  teamId,
  onMessage,
  onMessageEdited,
  onMessageDeleted,
  onTyping,
  onError
}: UseTeamChatSocketOptions) => {
  const { socket, isConnected } = useWebSocket();
  const teamIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !teamId) return;

    if (teamIdRef.current && teamIdRef.current !== teamId) {
      socket.emit('leave_team_chat', { team_id: teamIdRef.current });
    }

    socket.emit('join_team_chat', { team_id: teamId });
    teamIdRef.current = teamId;

    return () => {
      if (teamIdRef.current) {
        socket.emit('leave_team_chat', { team_id: teamIdRef.current });
        teamIdRef.current = null;
      }
    };
  }, [socket, isConnected, teamId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: TeamMessage) => {
      if (onMessage && message.channel_id === teamId) {
        onMessage(message);
      }
    };

    const handleTyping = (data: { user_id: string; username?: string; team_id: string; is_typing: boolean }) => {
      if (onTyping && data.team_id === teamId) {
        onTyping({ user_id: data.user_id, username: data.username, is_typing: data.is_typing });
      }
    };

    const handleMessageEdited = (message: TeamMessage) => {
      if (onMessageEdited && message.channel_id === teamId) {
        onMessageEdited(message);
      }
    };

    const handleMessageDeleted = (data: { message_id: string; user_id: string; team_id: string }) => {
      if (onMessageDeleted && data.team_id === teamId) {
        onMessageDeleted(data);
      }
    };

    const handleError = (error: { message: string }) => {
      if (onError) {
        onError(error.message);
      }
    };

    socket.on('team_message_received', handleMessage);
    socket.on('team_message_edited', handleMessageEdited);
    socket.on('team_message_deleted', handleMessageDeleted);
    socket.on('user_typing_team', handleTyping);
    socket.on('error', handleError);

    return () => {
      socket.off('team_message_received', handleMessage);
      socket.off('team_message_edited', handleMessageEdited);
      socket.off('team_message_deleted', handleMessageDeleted);
      socket.off('user_typing_team', handleTyping);
      socket.off('error', handleError);
    };
  }, [socket, teamId, onMessage, onMessageEdited, onMessageDeleted, onTyping, onError]);

  const sendMessage = useCallback((message: string, replyTo?: string) => {
    if (!socket || !isConnected || !teamId) return;

    socket.emit('send_team_message', {
      message,
      team_id: teamId,
      reply_to: replyTo
    });
  }, [socket, isConnected, teamId]);

  const editMessage = useCallback((messageId: string, content: string) => {
    if (!socket || !isConnected || !teamId) return;

    socket.emit('edit_team_message', {
      message_id: messageId,
      content,
      team_id: teamId
    });
  }, [socket, isConnected, teamId]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!socket || !isConnected || !teamId) return;

    socket.emit('delete_team_message', {
      message_id: messageId,
      team_id: teamId
    });
  }, [socket, isConnected, teamId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socket || !isConnected || !teamId) return;

    socket.emit('typing_team', {
      team_id: teamId,
      is_typing: isTyping
    });
  }, [socket, isConnected, teamId]);

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    sendTyping,
    isConnected
  };
};

