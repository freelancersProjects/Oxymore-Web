import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthenticatedSocket } from '../types/socketTypes';
import { connectionStore } from '../store/connectionStore';

interface JwtPayload {
  id: string;
  username?: string;
}

/**
 * Middleware d'authentification pour les connexions WebSocket
 */
export const socketAuth = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

    socket.userId = decoded.id;
    socket.username = decoded.username;

    connectionStore.addConnection(decoded.id, socket.id, decoded.username);

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new Error('Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new Error('Token expired'));
    }
    next(new Error('Authentication failed'));
  }
};

