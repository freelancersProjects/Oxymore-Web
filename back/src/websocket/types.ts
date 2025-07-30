export interface WebSocketUser {
  id: string;
  username: string;
  email: string;
  role: string;
  socketId: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface WebSocketMessage {
  id: string;
  type: 'notification' | 'user_update' | 'stats_change' | 'match_update' | 'chat_message';
  data: any;
  timestamp: Date;
  userId?: string;
  targetUsers?: string[];
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  read: boolean;
  createdAt: Date;
}

export interface UserUpdateData {
  userId: string;
  field: string;
  oldValue: any;
  newValue: any;
  updatedAt: Date;
}

export interface StatsChangeData {
  type: 'users' | 'verified_users' | 'premium_users' | 'active_matches';
  oldValue: number;
  newValue: number;
  percentageChange: number;
  timestamp: Date;
}

export interface MatchUpdateData {
  matchId: string;
  status: 'pending' | 'live' | 'finished';
  score?: string;
  teams?: string[];
  updatedAt: Date;
}

export interface ChatMessageData {
  id: string;
  userId: string;
  username: string;
  message: string;
  roomId: string;
  timestamp: Date;
}

// Événements côté serveur
export interface ServerToClientEvents {
  // Notifications
  'notification:new': (notification: NotificationData) => void;
  'notification:read': (notificationId: string) => void;
  
  // User updates
  'user:updated': (update: UserUpdateData) => void;
  'user:online': (user: WebSocketUser) => void;
  'user:offline': (userId: string) => void;
  
  // Stats
  'stats:changed': (stats: StatsChangeData) => void;
  
  // Matches
  'match:updated': (match: MatchUpdateData) => void;
  'match:live': (matchId: string) => void;
  
  // Chat
  'chat:message': (message: ChatMessageData) => void;
  'chat:typing': (data: { userId: string; roomId: string; isTyping: boolean }) => void;
  
  // System
  'system:connected': (data: { userId: string; onlineUsers: number }) => void;
  'system:disconnected': (data: { userId: string; onlineUsers: number }) => void;
}

// Événements côté client
export interface ClientToServerEvents {
  // Authentication
  'auth:login': (data: { userId: string; token: string }) => void;
  'auth:logout': () => void;
  
  // User actions
  'user:typing': (data: { roomId: string; isTyping: boolean }) => void;
  'user:read_notification': (notificationId: string) => void;
  
  // Chat
  'chat:join_room': (roomId: string) => void;
  'chat:leave_room': (roomId: string) => void;
  'chat:send_message': (data: { roomId: string; message: string }) => void;
  
  // Admin actions
  'admin:update_user': (data: { userId: string; updates: any }) => void;
  'admin:send_notification': (data: { targetUsers: string[]; notification: any }) => void;
}

// Événements inter-serveur
export interface InterServerEvents {
  'user:connected': (user: WebSocketUser) => void;
  'user:disconnected': (userId: string) => void;
  'notification:sent': (notification: NotificationData) => void;
  'stats:updated': (stats: StatsChangeData) => void;
} 