import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socketTypes';
import { RoomUtils } from '../utils/roomUtils';
import { connectionStore } from '../store/connectionStore';
import * as PrivateMessageService from '../../services/messaging/privateMessageService';
import { db } from '../../config/db';

export const setupPrivateMessageHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on('join_private_chat', async (data: { friend_id: string }) => {
    if (!data.friend_id || !socket.userId) return;

    const roomId = `private:${[socket.userId, data.friend_id].sort().join(':')}`;
    RoomUtils.joinRoom(io, socket, roomId);
    socket.emit('joined_private_chat', { friend_id: data.friend_id });
  });

  socket.on('leave_private_chat', async (data: { friend_id: string }) => {
    if (!data.friend_id) return;

    const roomId = `private:${[socket.userId, data.friend_id].sort().join(':')}`;
    RoomUtils.leaveRoom(io, socket, roomId);
    
    socket.emit('left_private_chat', { friend_id: data.friend_id });
  });

  socket.on('send_private_message', async (payload: { message: string; friend_id: string; reply_to?: string }) => {
    if (!payload.message || !payload.friend_id || !socket.userId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    try {
      const messageData = {
        content: payload.message,
        receiver_id: payload.friend_id,
        sender_id: socket.userId,
        is_read: false,
        reply_to: payload.reply_to || undefined
      };

      const createdMessage = await PrivateMessageService.createPrivateMessage(messageData);

      const [userRows] = await db.query(
        'SELECT username, avatar_url FROM user WHERE id_user = ?',
        [socket.userId]
      );
      const user = (userRows as any[])[0] || {};

      const messageResponse = {
        id_message: createdMessage.id_private_message.toString(),
        content: createdMessage.content,
        created_at: createdMessage.sent_at || new Date().toISOString(),
        sender_id: socket.userId || '',
        receiver_id: payload.friend_id,
        username: user.username,
        avatar_url: user.avatar_url,
        reply_to: createdMessage.reply_to || undefined,
        reply_content: createdMessage.reply_content || undefined,
        reply_username: createdMessage.reply_username || undefined,
        reply_sender_id: createdMessage.reply_sender_id || undefined
      };

      const roomId = `private:${[socket.userId, payload.friend_id].sort().join(':')}`;
      io.to(roomId).emit('private_message_received', messageResponse);
    } catch (error: any) {
      socket.emit('error', { message: 'Failed to send message', error: error.message });
    }
  });

  socket.on('typing_private', (payload: { friend_id: string; is_typing: boolean }) => {
    if (!payload.friend_id || !socket.userId) return;

    const roomId = `private:${[socket.userId, payload.friend_id].sort().join(':')}`;
    socket.to(roomId).emit('user_typing_private', {
      user_id: socket.userId,
      username: socket.username,
      friend_id: payload.friend_id,
      is_typing: payload.is_typing
    });
  });

  socket.on('edit_private_message', async (payload: { message_id: string; content: string; friend_id: string }) => {
    if (!payload.message_id || !payload.content || !payload.friend_id || !socket.userId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    try {
      const message = await PrivateMessageService.getPrivateMessageById(payload.message_id);
      if (message.sender_id !== socket.userId) {
        socket.emit('error', { message: 'You can only edit your own messages' });
        return;
      }

      const updatedMessage = await PrivateMessageService.updatePrivateMessage(payload.message_id, payload.content);

      const [userRows] = await db.query(
        'SELECT username, avatar_url FROM user WHERE id_user = ?',
        [socket.userId]
      );
      const user = (userRows as any[])[0] || {};

      const messageResponse = {
        id_message: updatedMessage.id_private_message.toString(),
        content: updatedMessage.content,
        created_at: updatedMessage.sent_at || new Date().toISOString(),
        sender_id: socket.userId || '',
        receiver_id: payload.friend_id,
        username: user.username,
        avatar_url: user.avatar_url,
        reply_to: updatedMessage.reply_to || undefined,
        reply_content: updatedMessage.reply_content || undefined,
        reply_username: updatedMessage.reply_username || undefined,
        reply_sender_id: updatedMessage.reply_sender_id || undefined
      };

      const roomId = `private:${[socket.userId, payload.friend_id].sort().join(':')}`;
      io.to(roomId).emit('private_message_edited', messageResponse);
    } catch (error: any) {
      socket.emit('error', { message: 'Failed to edit message', error: error.message });
    }
  });

  socket.on('delete_private_message', async (payload: { message_id: string; friend_id: string }) => {
    if (!payload.message_id || !payload.friend_id || !socket.userId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    try {
      const message = await PrivateMessageService.getPrivateMessageById(payload.message_id);
      if (message.sender_id !== socket.userId) {
        socket.emit('error', { message: 'You can only delete your own messages' });
        return;
      }

      await PrivateMessageService.deletePrivateMessage(payload.message_id);

      const roomId = `private:${[socket.userId, payload.friend_id].sort().join(':')}`;
      io.to(roomId).emit('private_message_deleted', {
        message_id: payload.message_id,
        sender_id: socket.userId,
        receiver_id: payload.friend_id
      });
    } catch (error: any) {
      socket.emit('error', { message: 'Failed to delete message', error: error.message });
    }
  });
};

