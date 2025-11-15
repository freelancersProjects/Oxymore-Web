import { useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface UsePresenceSocketOptions {
  onUserOnline?: (data: { user_id: string }) => void;
  onUserOffline?: (data: { user_id: string }) => void;
}

export const usePresenceSocket = ({ onUserOnline, onUserOffline }: UsePresenceSocketOptions = {}) => {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data: { user_id: string }) => {
      if (onUserOnline) {
        onUserOnline(data);
      }
    };

    const handleUserOffline = (data: { user_id: string }) => {
      if (onUserOffline) {
        onUserOffline(data);
      }
    };

    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [socket, onUserOnline, onUserOffline]);
};



