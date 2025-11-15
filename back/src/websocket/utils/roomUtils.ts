import { Server } from 'socket.io';
import { connectionStore } from '../store/connectionStore';
import { AuthenticatedSocket } from '../types/socketTypes';

/**
 * Utilitaires pour gérer les rooms WebSocket
 */
export class RoomUtils {
  /**
   * Rejoint une room et met à jour le store
   */
  static joinRoom(io: Server, socket: AuthenticatedSocket, roomId: string): void {
    socket.join(roomId);
    connectionStore.joinRoom(socket.id, roomId);
  }

  static leaveRoom(io: Server, socket: AuthenticatedSocket, roomId: string): void {
    socket.leave(roomId);
    connectionStore.leaveRoom(socket.id, roomId);
  }

  /**
   * Émet un événement à tous les membres d'une room
   */
  static emitToRoom(io: Server, roomId: string, event: string, data: any): void {
    io.to(roomId).emit(event, data);
  }

  /**
   * Émet un événement à tous les membres d'une room sauf l'émetteur
   */
  static emitToRoomExceptSender(
    io: Server,
    roomId: string,
    socketId: string,
    event: string,
    data: any
  ): void {
    socketId && io.to(roomId).except(socketId).emit(event, data);
  }

  /**
   * Récupère les membres d'une room
   */
  static getRoomMembers(roomId: string): string[] {
    return connectionStore.getRoomUsers(roomId);
  }

  /**
   * Génère un roomId pour un chat privé entre deux utilisateurs
   */
  static getPrivateRoomId(userId1: string, userId2: string): string {
    // Trier les IDs pour avoir toujours le même roomId peu importe l'ordre
    const sorted = [userId1, userId2].sort();
    return `private:${sorted[0]}:${sorted[1]}`;
  }

  /**
   * Génère un roomId pour un channel
   */
  static getChannelRoomId(channelId: string): string {
    return `channel:${channelId}`;
  }
}

