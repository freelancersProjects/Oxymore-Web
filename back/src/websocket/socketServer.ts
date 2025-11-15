import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketAuth } from './middleware/socketAuth';
import { setupTeamChatHandler } from './handlers/teamChatHandler';
import { setupPresenceHandler } from './handlers/presenceHandler';
import { setupNotificationHandler } from './handlers/notificationHandler';
import { setupFriendRequestHandler } from './handlers/friendRequestHandler';
import { setupPrivateMessageHandler } from './handlers/privateMessageHandler';
import { connectionStore } from './store/connectionStore';
import { AuthenticatedSocket } from './types/socketTypes';

let io: Server | null = null;

export const initializeSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://oxymore-web-oxymore-admin.vercel.app',
        'https://oxymore-web-oxymore-app.vercel.app',
        'https://oxymore-web-oxymore-site.vercel.app',
        'https://mathis.alwaysdata.net'
      ],
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  io.use((socket, next) => {
    socketAuth(socket as AuthenticatedSocket, next);
  });

  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;

    setupTeamChatHandler(io!, authSocket);
    setupPresenceHandler(io!, authSocket);
    setupNotificationHandler(io!, authSocket);
    setupFriendRequestHandler(io!, authSocket);
    setupPrivateMessageHandler(io!, authSocket);

    if (authSocket.userId) {
      const userSockets = connectionStore.getUserSockets(authSocket.userId);
      if (userSockets.length === 1) {
        io!.emit('user_online', { user_id: authSocket.userId });
      }
    }

    socket.on('disconnect', () => {
      connectionStore.removeConnection(authSocket.id);
      if (authSocket.userId) {
        const userSockets = connectionStore.getUserSockets(authSocket.userId);
        if (userSockets.length === 0) {
          const { db } = require('../config/db');
          db.query(
            'UPDATE user SET online_status = ? WHERE id_user = ?',
            ['offline', authSocket.userId]
          ).catch(() => {});
          io!.emit('user_offline', { user_id: authSocket.userId });
        }
      }
    });
  });
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocketServer first.');
  }
  return io;
};

