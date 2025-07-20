import { UserFollowing } from "../models/userFollowingModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllUserFollowings = async (): Promise<UserFollowing[]> => {
  const [rows] = await db.query("SELECT * FROM user_following");
  return rows as UserFollowing[];
};

export const createUserFollowing = async (data: Omit<UserFollowing, "id_user_following">): Promise<UserFollowing> => {
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
  return { id_user_following, ...data };
};

export const deleteUserFollowing = async (id_user_following: string): Promise<void> => {
  await db.query("DELETE FROM user_following WHERE id_user_following = ?", [id_user_following]);
};
