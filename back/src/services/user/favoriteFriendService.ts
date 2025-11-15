import { db } from "../../config/db";
import { FavoriteFriend, FavoriteFriendData, FavoriteFriendInput } from "../../interfaces/user/favoriteFriendInterfaces";
import crypto from "crypto";

export const getAllFavoriteFriends = async (): Promise<FavoriteFriend[]> => {
  const [rows] = await db.query("SELECT * FROM favorite_friends ORDER BY created_at DESC");
  return rows as FavoriteFriend[];
};

export const getFavoriteFriendsByUserId = async (userId: string): Promise<FavoriteFriend[]> => {
  const [rows] = await db.query(
    "SELECT * FROM favorite_friends WHERE id_user = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows as FavoriteFriend[];
};

export const getFavoriteFriendById = async (id: string): Promise<FavoriteFriend | null> => {
  const [rows] = await db.query("SELECT * FROM favorite_friends WHERE id_favorite_friend = ?", [id]);
  const favorites = rows as FavoriteFriend[];
  return favorites.length > 0 ? favorites[0] : null;
};

export const getFavoriteFriendByUserAndFriend = async (userId: string, friendId: string): Promise<FavoriteFriend | null> => {
  const [rows] = await db.query(
    "SELECT * FROM favorite_friends WHERE id_user = ? AND id_friend = ?",
    [userId, friendId]
  );
  const favorites = rows as FavoriteFriend[];
  return favorites.length > 0 ? favorites[0] : null;
};

export const createFavoriteFriend = async (data: FavoriteFriendInput): Promise<FavoriteFriendData> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.query(
    "INSERT INTO favorite_friends (id_favorite_friend, id_user, id_friend, created_at) VALUES (?, ?, ?, ?)",
    [id, data.id_user, data.id_friend, now]
  );

  return {
    id_favorite_friend: id,
    id_user: data.id_user,
    id_friend: data.id_friend,
    created_at: now
  };
};

export const deleteFavoriteFriend = async (id: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM favorite_friends WHERE id_favorite_friend = ?", [id]);
  return (result as any).affectedRows > 0;
};

export const deleteFavoriteFriendByUserAndFriend = async (userId: string, friendId: string): Promise<boolean> => {
  const [result] = await db.query(
    "DELETE FROM favorite_friends WHERE id_user = ? AND id_friend = ?",
    [userId, friendId]
  );
  return (result as any).affectedRows > 0;
};

export const toggleFavoriteFriend = async (userId: string, friendId: string): Promise<{ is_favorite: boolean; favorite_friend: FavoriteFriendData | null }> => {
  const existing = await getFavoriteFriendByUserAndFriend(userId, friendId);
  
  if (existing) {
    await deleteFavoriteFriend(existing.id_favorite_friend);
    return { is_favorite: false, favorite_friend: null };
  } else {
    const favorite = await createFavoriteFriend({ id_user: userId, id_friend: friendId });
    return { is_favorite: true, favorite_friend: favorite };
  }
};

