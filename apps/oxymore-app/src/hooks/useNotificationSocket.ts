import { useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface Notification {
  id_notification: string;
  type: string;
  title: string;
  text: string;
  created_at: string;
  id_user: string | null;
}

interface UseNotificationSocketOptions {
  onNotification?: (notification: Notification) => void;
}

export const useNotificationSocket = ({ onNotification }: UseNotificationSocketOptions = {}) => {
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('subscribe_notifications');

    const handleNotification = (notification: Notification) => {
      if (onNotification) {
        onNotification(notification);
      }
    };

    socket.on('notification_received', handleNotification);

    return () => {
      socket.emit('unsubscribe_notifications');
      socket.off('notification_received', handleNotification);
    };
  }, [socket, isConnected, onNotification]);
};



