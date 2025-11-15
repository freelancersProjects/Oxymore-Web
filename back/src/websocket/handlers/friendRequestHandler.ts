import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socketTypes';
import { connectionStore } from '../store/connectionStore';

export const setupFriendRequestHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on('subscribe_friend_requests', () => {
    if (!socket.userId) return;
    socket.join(`friend_requests:${socket.userId}`);
  });

  socket.on('unsubscribe_friend_requests', () => {
    if (!socket.userId) return;
    socket.leave(`friend_requests:${socket.userId}`);
  });
};

export const emitFriendRequest = (io: Server, userId: string, friendRequest: any) => {
  io.to(`friend_requests:${userId}`).emit('friend_request_received', friendRequest);
};

export const emitFriendRequestAccepted = (io: Server, userId: string, friendData: any) => {
  io.to(`friend_requests:${userId}`).emit('friend_request_accepted', friendData);
};

export const emitFriendRequestRejected = (io: Server, userId: string, friendId: string) => {
  io.to(`friend_requests:${userId}`).emit('friend_request_rejected', { id_friend: friendId });
};



