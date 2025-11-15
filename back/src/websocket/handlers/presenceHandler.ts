import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socketTypes';
import { connectionStore } from '../store/connectionStore';
import { db } from '../../config/db';

export const setupPresenceHandler = (io: Server, socket: AuthenticatedSocket) => {
  if (!socket.userId) return;

  db.query(
    'UPDATE user SET online_status = ? WHERE id_user = ?',
    ['online', socket.userId]
  ).catch(() => {});
};

