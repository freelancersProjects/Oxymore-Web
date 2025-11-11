import { RowDataPacket } from 'mysql2';

export interface FavoriteFriend extends RowDataPacket {
  id_favorite_friend: string;
  id_user: string;
  id_friend: string;
  created_at: string;
}

export interface FavoriteFriendData {
  id_favorite_friend: string;
  id_user: string;
  id_friend: string;
  created_at: string;
}

export interface FavoriteFriendInput {
  id_user: string;
  id_friend: string;
}


