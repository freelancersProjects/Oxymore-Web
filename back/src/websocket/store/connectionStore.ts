import { SocketUser } from '../types/socketTypes';

/**
 * Store en mémoire pour gérer les connexions WebSocket
 * Alternative à Redis sans Docker
 */
class ConnectionStore {
  // Map userId -> Set<socketId> (un utilisateur peut avoir plusieurs connexions)
  private userConnections: Map<string, Set<string>> = new Map();
  
  // Map socketId -> SocketUser (métadonnées de chaque socket)
  private socketUsers: Map<string, SocketUser> = new Map();
  
  // Map roomId -> Set<socketId> (utilisateurs dans chaque room/channel)
  private roomConnections: Map<string, Set<string>> = new Map();

  /**
   * Ajoute une connexion pour un utilisateur
   */
  addConnection(userId: string, socketId: string, username?: string): void {
    // Ajouter à la liste des connexions de l'utilisateur
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(socketId);

    // Créer les métadonnées de la socket
    this.socketUsers.set(socketId, {
      userId,
      socketId,
      username,
      rooms: new Set(),
    });
  }

  /**
   * Supprime une connexion
   */
  removeConnection(socketId: string): void {
    const socketUser = this.socketUsers.get(socketId);
    if (!socketUser) return;

    const { userId, rooms } = socketUser;

    // Retirer de la liste des connexions de l'utilisateur
    const userSockets = this.userConnections.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userConnections.delete(userId);
      }
    }

    // Retirer de toutes les rooms
    rooms.forEach((roomId) => {
      this.leaveRoom(socketId, roomId);
    });

    // Supprimer les métadonnées
    this.socketUsers.delete(socketId);
  }

  /**
   * Rejoint une room
   */
  joinRoom(socketId: string, roomId: string): void {
    const socketUser = this.socketUsers.get(socketId);
    if (!socketUser) return;

    socketUser.rooms.add(roomId);

    if (!this.roomConnections.has(roomId)) {
      this.roomConnections.set(roomId, new Set());
    }
    this.roomConnections.get(roomId)!.add(socketId);
  }

  /**
   * Quitte une room
   */
  leaveRoom(socketId: string, roomId: string): void {
    const socketUser = this.socketUsers.get(socketId);
    if (socketUser) {
      socketUser.rooms.delete(roomId);
    }

    const roomSockets = this.roomConnections.get(roomId);
    if (roomSockets) {
      roomSockets.delete(socketId);
      if (roomSockets.size === 0) {
        this.roomConnections.delete(roomId);
      }
    }
  }

  /**
   * Récupère tous les socketIds d'un utilisateur
   */
  getUserSockets(userId: string): string[] {
    const sockets = this.userConnections.get(userId);
    return sockets ? Array.from(sockets) : [];
  }

  /**
   * Récupère tous les socketIds d'une room
   */
  getRoomSockets(roomId: string): string[] {
    const sockets = this.roomConnections.get(roomId);
    return sockets ? Array.from(sockets) : [];
  }

  /**
   * Récupère les métadonnées d'une socket
   */
  getSocketUser(socketId: string): SocketUser | undefined {
    return this.socketUsers.get(socketId);
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  isUserConnected(userId: string): boolean {
    const sockets = this.userConnections.get(userId);
    return sockets ? sockets.size > 0 : false;
  }

  /**
   * Récupère tous les utilisateurs connectés dans une room
   */
  getRoomUsers(roomId: string): string[] {
    const sockets = this.getRoomSockets(roomId);
    const userIds = new Set<string>();
    
    sockets.forEach((socketId) => {
      const socketUser = this.getSocketUser(socketId);
      if (socketUser) {
        userIds.add(socketUser.userId);
      }
    });

    return Array.from(userIds);
  }

  /**
   * Récupère toutes les rooms d'un socket
   */
  getSocketRooms(socketId: string): string[] {
    const socketUser = this.socketUsers.get(socketId);
    return socketUser ? Array.from(socketUser.rooms) : [];
  }

  /**
   * Nettoie toutes les connexions (utile pour les tests)
   */
  clear(): void {
    this.userConnections.clear();
    this.socketUsers.clear();
    this.roomConnections.clear();
  }

  /**
   * Récupère le nombre total de connexions
   */
  getTotalConnections(): number {
    return this.socketUsers.size;
  }

  /**
   * Récupère le nombre d'utilisateurs uniques connectés
   */
  getUniqueUsersCount(): number {
    return this.userConnections.size;
  }
}

// Singleton
export const connectionStore = new ConnectionStore();



