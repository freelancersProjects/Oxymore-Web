import { Server as HttpServer } from 'http';
import { WebSocketServer } from './socketServer';

export class WebSocketManager {
  private wsServer: WebSocketServer;

  constructor(httpServer: HttpServer) {
    this.wsServer = new WebSocketServer(httpServer);
    console.log('WebSocket Manager initialized');
  }

  public getWebSocketServer() {
    return this.wsServer;
  }

  public getConnectedUsersCount() {
    return this.wsServer.getOnlineUsersCount();
  }

  public getConnectedUsers() {
    return this.wsServer.getConnectedUsers();
  }
} 