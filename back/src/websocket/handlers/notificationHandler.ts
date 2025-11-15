import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socketTypes';
import { connectionStore } from '../store/connectionStore';

export const setupNotificationHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on('subscribe_notifications', () => {
    if (!socket.userId) return;
    socket.join(`notifications:${socket.userId}`);
  });

  socket.on('unsubscribe_notifications', () => {
    if (!socket.userId) return;
    socket.leave(`notifications:${socket.userId}`);
  });
};

export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(`notifications:${userId}`).emit('notification_received', notification);
};



