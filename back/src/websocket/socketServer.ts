import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents,
  WebSocketUser,
  WebSocketMessage 
} from './types';

export class WebSocketServer {
  private io!: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;
  private connectedUsers: Map<string, WebSocketUser> = new Map();

  constructor(httpServer: HttpServer) {
    this.initializeSocketServer(httpServer);
    this.setupEventHandlers();
  }

  private initializeSocketServer(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:5174", 
          "http://localhost:5175"
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    console.log('WebSocket server initialized');
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`New connection: ${socket.id}`);

      socket.on('auth:login', async (data) => {
        try {
          const user: WebSocketUser = {
            id: data.userId,
            username: 'User',
            email: 'user@example.com',
            role: 'user',
            socketId: socket.id,
            isOnline: true,
            lastSeen: new Date()
          };

          this.connectedUsers.set(data.userId, user);
          socket.data.userId = data.userId;

          socket.join(`user:${data.userId}`);
          
          if (user.role === 'admin') {
            socket.join('admin:room');
          }

          socket.broadcast.emit('user:online', user);
          socket.emit('system:connected', {
            userId: data.userId,
            onlineUsers: this.connectedUsers.size
          });

          console.log(`User ${data.userId} connected`);
        } catch (error) {
          console.error('Auth error:', error);
          socket.emit('system:connected' as any, { error: 'Authentication failed' });
        }
      });

      socket.on('user:typing', (data) => {
        socket.to(data.roomId).emit('chat:typing', {
          userId: socket.data.userId,
          roomId: data.roomId,
          isTyping: data.isTyping
        });
      });

      socket.on('user:read_notification', (notificationId) => {
        socket.emit('notification:read', notificationId);
      });

      socket.on('chat:join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.data.userId} joined room ${roomId}`);
      });

      socket.on('chat:leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.data.userId} left room ${roomId}`);
      });

      socket.on('chat:send_message', (data) => {
        const message = {
          id: Date.now().toString(),
          userId: socket.data.userId,
          username: this.connectedUsers.get(socket.data.userId)?.username || 'Unknown',
          message: data.message,
          roomId: data.roomId,
          timestamp: new Date()
        };

        socket.to(data.roomId).emit('chat:message', message);
        console.log(`Message sent in room ${data.roomId}`);
      });

      socket.on('admin:update_user', (data) => {
        if (this.connectedUsers.get(socket.data.userId)?.role === 'admin') {
          this.broadcastToAdmins('user:updated', {
            userId: data.userId,
            field: 'updated',
            oldValue: null,
            newValue: data.updates,
            updatedAt: new Date()
          });
        }
      });

      socket.on('admin:send_notification', (data) => {
        if (this.connectedUsers.get(socket.data.userId)?.role === 'admin') {
          data.targetUsers.forEach(userId => {
            this.io.to(`user:${userId}`).emit('notification:new', {
              id: Date.now().toString(),
              title: data.notification.title,
              message: data.notification.message,
              type: data.notification.type || 'info',
              userId: userId,
              read: false,
              createdAt: new Date()
            });
          });
        }
      });

      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
          this.connectedUsers.delete(userId);
          socket.broadcast.emit('user:offline', userId);
          socket.broadcast.emit('system:disconnected', {
            userId: userId,
            onlineUsers: this.connectedUsers.size
          });
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  }

  public getIO() {
    return this.io;
  }

  public getConnectedUsers() {
    return this.connectedUsers;
  }

  public broadcastToAdmins(event: string, data: any) {
    this.io.to('admin:room').emit(event as any, data);
  }

  public sendToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event as any, data);
  }

  public broadcastToAll(event: string, data: any) {
    this.io.emit(event as any, data);
  }

  public getOnlineUsersCount() {
    return this.connectedUsers.size;
  }
} 