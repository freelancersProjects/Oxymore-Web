import { Server } from 'socket.io';
import { AuthenticatedSocket, ChatMessagePayload, ChatMessageResponse, TypingPayload } from '../types/socketTypes';
import { RoomUtils } from '../utils/roomUtils';
import { connectionStore } from '../store/connectionStore';
import * as TeamChatService from '../../services/team/teamChatService';
import { db } from '../../config/db';

export const setupTeamChatHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on('join_team_chat', async (data: { team_id: string }) => {
    if (!data.team_id || !socket.userId) return;

    const roomId = `team:${data.team_id}`;
    RoomUtils.joinRoom(io, socket, roomId);
    socket.emit('joined_team_chat', { team_id: data.team_id });
  });

  socket.on('leave_team_chat', async (data: { team_id: string }) => {
    if (!data.team_id) return;

    const roomId = `team:${data.team_id}`;
    RoomUtils.leaveRoom(io, socket, roomId);
    
    socket.emit('left_team_chat', { team_id: data.team_id });
  });

  socket.on('send_team_message', async (payload: { message: string; team_id: string; reply_to?: string }) => {
    if (!payload.message || !payload.team_id || !socket.userId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    try {
      const messageData = {
        message: payload.message,
        id_team: payload.team_id,
        id_user: socket.userId,
        reply_to: payload.reply_to || null,
        sent_at: new Date().toISOString()
      };

      const createdMessage = await TeamChatService.createTeamChat(messageData);

      const [userRows] = await db.query(
        'SELECT username, avatar_url FROM user WHERE id_user = ?',
        [socket.userId]
      );
      const user = (userRows as any[])[0] || {};

      const messageResponse: ChatMessageResponse = {
        id_message: createdMessage.id_team_chat,
        content: createdMessage.message,
        created_at: createdMessage.sent_at || new Date().toISOString(),
        user_id: socket.userId || '',
        channel_id: payload.team_id,
        is_from_ai: false,
        username: user.username,
        avatar_url: user.avatar_url
      };

      const roomId = `team:${payload.team_id}`;
      io.to(roomId).emit('team_message_received', messageResponse);
    } catch (error: any) {
      socket.emit('error', { message: 'Failed to send message', error: error.message });
    }
  });

  socket.on('typing_team', (payload: TypingPayload & { team_id: string }) => {
    if (!payload.team_id || !socket.userId) return;

    const roomId = `team:${payload.team_id}`;
    socket.to(roomId).emit('user_typing_team', {
      user_id: socket.userId,
      username: socket.username,
      team_id: payload.team_id,
      is_typing: payload.is_typing
    });
  });

  socket.on('edit_team_message', async (payload: { message_id: string; content: string; team_id: string }) => {
    if (!payload.message_id || !payload.content || !payload.team_id || !socket.userId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    try {
      const message = await TeamChatService.getTeamChatById(payload.message_id);
      if (message.id_user !== socket.userId) {
        socket.emit('error', { message: 'You can only edit your own messages' });
        return;
      }

      const updatedMessage = await TeamChatService.updateTeamChat(payload.message_id, payload.content);

      const [userRows] = await db.query(
        'SELECT username, avatar_url FROM user WHERE id_user = ?',
        [socket.userId]
      );
      const user = (userRows as any[])[0] || {};

      const messageResponse: ChatMessageResponse = {
        id_message: updatedMessage.id_team_chat,
        content: updatedMessage.message,
        created_at: updatedMessage.sent_at || new Date().toISOString(),
        user_id: socket.userId || '',
        channel_id: payload.team_id,
        is_from_ai: false,
        username: user.username,
        avatar_url: user.avatar_url
      };

      const roomId = `team:${payload.team_id}`;
      io.to(roomId).emit('team_message_edited', messageResponse);
    } catch (error: any) {
      socket.emit('error', { message: 'Failed to edit message', error: error.message });
    }
  });

  socket.on('delete_team_message', async (payload: { message_id: string; team_id: string }) => {
    if (!payload.message_id || !payload.team_id || !socket.userId) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    try {
      const message = await TeamChatService.getTeamChatById(payload.message_id);
      if (message.id_user !== socket.userId) {
        socket.emit('error', { message: 'You can only delete your own messages' });
        return;
      }

      await TeamChatService.deleteTeamChat(payload.message_id);

      const roomId = `team:${payload.team_id}`;
      io.to(roomId).emit('team_message_deleted', {
        message_id: payload.message_id,
        user_id: socket.userId,
        team_id: payload.team_id
      });
    } catch (error: any) {
      socket.emit('error', { message: 'Failed to delete message', error: error.message });
    }
  });

  socket.on('disconnect', () => {
    const rooms = connectionStore.getSocketRooms(socket.id);
    rooms.forEach((roomId: string) => {
      if (roomId.startsWith('team:')) {
        const teamId = roomId.replace('team:', '');
        socket.to(roomId).emit('user_left_team_chat', {
          user_id: socket.userId,
          team_id: teamId
        });
      }
    });
  });
};

