import { UserFollowing, UserFollowingData } from "../../interfaces/user/userInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllUserFollowings = async (): Promise<UserFollowing[]> => {
  const [rows] = await db.query("SELECT * FROM user_following");
  return rows as UserFollowing[];
};

export const createUserFollowing = async (data: { followed_at?: string; id_follower: string; id_followed: string }): Promise<UserFollowingData> => {
  const id_user_following = crypto.randomUUID();
  await db.query(
    "INSERT INTO user_following (id_user_following, followed_at, id_follower, id_followed) VALUES (?, ?, ?, ?)",
    [
      id_user_following,
      data.followed_at ?? new Date().toISOString(),
      data.id_follower,
      data.id_followed
    ]
  );
  return {
    id_user_following,
    followed_at: data.followed_at ?? new Date().toISOString(),
    id_follower: data.id_follower,
    id_followed: data.id_followed
  };
};

export const deleteUserFollowing = async (id_user_following: string): Promise<void> => {
  await db.query("DELETE FROM user_following WHERE id_user_following = ?", [id_user_following]);
};

