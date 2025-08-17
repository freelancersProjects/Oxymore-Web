/**
 * @openapi
 * components:
 *   schemas:
 *     FriendInput:
 *       type: object
 *       required:
 *         - id_user_sender
 *         - id_user_receiver
 *       properties:
 *         id_user_sender:
 *           type: string
 *         id_user_receiver:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, blocked]
 *         is_favorite:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

export interface Friend {
  id_friend: string;
  id_user_sender: string;
  id_user_receiver: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface FriendInput {
  id_user_sender: string;
  id_user_receiver: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite?: boolean;
}

export interface FriendWithUser {
  id_friend: string;
  id_user_sender: string;
  id_user_receiver: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  // User info
  user_id: string;
  username: string;
  avatar_url?: string;
  elo: number;
  is_premium: boolean;
  verified: boolean;
  // Status info
  online_status?: 'online' | 'offline' | 'in-game';
  last_seen?: string;
}
