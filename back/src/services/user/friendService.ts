import { Friend, FriendData, FriendInput, FriendWithUser } from "../../interfaces/user/friendInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllFriends = async (): Promise<Friend[]> => {
  const [rows] = await db.query("SELECT * FROM friends");
  return rows as Friend[];
};

export const getFriendsByUserId = async (userId: string): Promise<FriendWithUser[]> => {
  try {
    const [tableCheck] = await db.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      AND table_name = 'favorite_friends'
    `);
    const tableExists = (tableCheck as any[])[0]?.count > 0;

    if (tableExists) {
      const [rows] = await db.query(`
        SELECT
          f.*,
          u.id_user as user_id,
          u.username,
          u.avatar_url,
          u.elo,
          u.is_premium,
          u.verified,
          u.online_status,
          u.last_seen,
          CASE WHEN ff.id_favorite_friend IS NOT NULL THEN 1 ELSE 0 END as is_favorite,
          fdn.display_name
        FROM friends f
        JOIN user u ON (f.id_user_sender = u.id_user OR f.id_user_receiver = u.id_user)
        LEFT JOIN favorite_friends ff ON ff.id_friend COLLATE utf8mb4_unicode_ci = f.id_friend COLLATE utf8mb4_unicode_ci AND ff.id_user COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci
        LEFT JOIN friend_display_names fdn ON fdn.id_friend COLLATE utf8mb4_unicode_ci = f.id_friend COLLATE utf8mb4_unicode_ci AND fdn.id_user COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci
        WHERE (f.id_user_sender = ? OR f.id_user_receiver = ?)
        AND f.status = 'accepted'
        AND u.id_user != ?
      `, [userId, userId, userId, userId, userId]);
      
      return (rows as any[]).map((row: any) => ({
        ...row,
        is_favorite: row.is_favorite === 1 || row.is_favorite === true || row.is_favorite === '1'
      }));
    } else {
      const [rows] = await db.query(`
        SELECT
          f.*,
          u.id_user as user_id,
          u.username,
          u.avatar_url,
          u.elo,
          u.is_premium,
          u.verified,
          u.online_status,
          u.last_seen,
          0 as is_favorite,
          fdn.display_name
        FROM friends f
        JOIN user u ON (f.id_user_sender = u.id_user OR f.id_user_receiver = u.id_user)
        LEFT JOIN friend_display_names fdn ON fdn.id_friend COLLATE utf8mb4_unicode_ci = f.id_friend COLLATE utf8mb4_unicode_ci AND fdn.id_user COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci
        WHERE (f.id_user_sender = ? OR f.id_user_receiver = ?)
        AND f.status = 'accepted'
        AND u.id_user != ?
      `, [userId, userId, userId, userId]);
      return (rows as any[]).map((row: any) => ({
        ...row,
        is_favorite: false
      }));
    }
  } catch (error: any) {
    console.error('Error in getFriendsByUserId:', error);
    const [rows] = await db.query(`
      SELECT
        f.*,
        u.id_user as user_id,
        u.username,
        u.avatar_url,
        u.elo,
        u.is_premium,
        u.verified,
        u.online_status,
        u.last_seen,
        0 as is_favorite,
        fdn.display_name
      FROM friends f
      JOIN user u ON (f.id_user_sender = u.id_user OR f.id_user_receiver = u.id_user)
      LEFT JOIN friend_display_names fdn ON fdn.id_friend COLLATE utf8mb4_unicode_ci = f.id_friend COLLATE utf8mb4_unicode_ci AND fdn.id_user COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci
      WHERE (f.id_user_sender = ? OR f.id_user_receiver = ?)
      AND f.status = 'accepted'
      AND u.id_user != ?
    `, [userId, userId, userId, userId]);
    return (rows as any[]).map((row: any) => ({
      ...row,
      is_favorite: false
    }));
  }
};

export const getPendingFriendRequests = async (userId: string): Promise<FriendWithUser[]> => {
  const [rows] = await db.query(`
    SELECT
      f.*,
      u.id_user as user_id,
      u.username,
      u.avatar_url,
      u.elo,
      u.is_premium,
      u.verified,
      u.online_status,
      u.last_seen
    FROM friends f
    JOIN user u ON f.id_user_sender = u.id_user
    WHERE f.id_user_receiver = ? AND f.status = 'pending'
  `, [userId]);
  return rows as FriendWithUser[];
};

export const getSentFriendRequests = async (userId: string): Promise<FriendWithUser[]> => {
  const [rows] = await db.query(`
    SELECT
      f.*,
      u.username,
      u.avatar_url,
      u.elo,
      u.is_premium,
      u.verified,
      u.online_status,
      u.last_seen
    FROM friends f
    JOIN user u ON f.id_user_receiver = u.id_user
    WHERE f.id_user_sender = ? AND f.status = 'pending'
  `, [userId]);
  return rows as FriendWithUser[];
};

export const getFriendById = async (id: string): Promise<Friend | null> => {
  const [rows] = await db.query("SELECT * FROM friends WHERE id_friend = ?", [id]);
  const friends = rows as Friend[];
  return friends.length > 0 ? friends[0] : null;
};

export const getFriendByUsers = async (user1Id: string, user2Id: string): Promise<Friend | null> => {
  const [rows] = await db.query(`
    SELECT * FROM friends
    WHERE (id_user_sender = ? AND id_user_receiver = ?)
    OR (id_user_sender = ? AND id_user_receiver = ?)
  `, [user1Id, user2Id, user2Id, user1Id]);
  const friends = rows as Friend[];
  return friends.length > 0 ? friends[0] : null;
};

export const createFriend = async (data: FriendInput): Promise<FriendData> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.query(
    "INSERT INTO friends (id_friend, id_user_sender, id_user_receiver, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id,
      data.id_user_sender,
      data.id_user_receiver,
      data.status || 'pending',
      now,
      now
    ]
  );

  return {
    id_friend: id,
    id_user_sender: data.id_user_sender,
    id_user_receiver: data.id_user_receiver,
    status: data.status || 'pending',
    created_at: now,
    updated_at: now
  };
};

export const updateFriend = async (id: string, data: Partial<FriendInput>): Promise<Friend | null> => {
  const now = new Date().toISOString();

  const updateFields: string[] = [];
  const updateValues: any[] = [];

  if (data.status !== undefined) {
    updateFields.push("status = ?");
    updateValues.push(data.status);
  }

  updateFields.push("updated_at = ?");
  updateValues.push(now);
  updateValues.push(id);

  if (updateFields.length === 0) {
    return getFriendById(id);
  }

  await db.query(
    `UPDATE friends SET ${updateFields.join(", ")} WHERE id_friend = ?`,
    updateValues
  );

  return getFriendById(id);
};

export const deleteFriend = async (id: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM friends WHERE id_friend = ?", [id]);
  return (result as any).affectedRows > 0;
};

export const acceptFriendRequest = async (id: string): Promise<Friend | null> => {
  return updateFriend(id, { status: 'accepted' });
};

export const rejectFriendRequest = async (id: string): Promise<Friend | null> => {
  return updateFriend(id, { status: 'rejected' });
};

export const cancelFriendRequest = async (id: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM friends WHERE id_friend = ? AND status = 'pending'", [id]);
  return (result as any).affectedRows > 0;
};

export const blockUser = async (id: string): Promise<Friend | null> => {
  return updateFriend(id, { status: 'blocked' });
};


export const searchUsersForFriends = async (userId: string, searchTerm: string): Promise<any[]> => {
  const [rows] = await db.query(`
    SELECT
      u.id_user,
      u.username,
      u.avatar_url,
      u.elo,
      u.is_premium,
      u.verified,
      u.online_status,
      u.last_seen,
      f.status as friend_status,
      f.id_friend
    FROM user u
    LEFT JOIN friends f ON (
      (f.id_user_sender = u.id_user AND f.id_user_receiver = ?)
      OR (f.id_user_sender = ? AND f.id_user_receiver = u.id_user)
    )
    WHERE u.id_user != ?
    AND u.username LIKE ?
    ORDER BY u.username
    LIMIT 20
  `, [userId, userId, userId, `%${searchTerm}%`]);

  return rows as any[];
};

export const updateFriendDisplayName = async (userId: string, friendId: string, displayName: string): Promise<{ display_name: string }> => {
  try {
    // Vérifier si le display_name existe déjà
    const [existing] = await db.query(`
      SELECT id_friend_display_name FROM friend_display_names
      WHERE id_user = ? AND id_friend = ?
    `, [userId, friendId]);

    if ((existing as any[]).length > 0) {
      // Mettre à jour le display_name existant
      await db.query(`
        UPDATE friend_display_names
        SET display_name = ?, updated_at = NOW()
        WHERE id_user = ? AND id_friend = ?
      `, [displayName, userId, friendId]);
    } else {
      // Créer un nouveau display_name
      const id = crypto.randomUUID();
      await db.query(`
        INSERT INTO friend_display_names (id_friend_display_name, id_user, id_friend, display_name)
        VALUES (?, ?, ?, ?)
      `, [id, userId, friendId, displayName]);
    }

    return { display_name: displayName };
  } catch (error: any) {
    console.error('Error updating friend display name:', error);
    throw error;
  }
};

export const deleteFriendDisplayName = async (userId: string, friendId: string): Promise<boolean> => {
  try {
    const [result] = await db.query(`
      DELETE FROM friend_display_names
      WHERE id_user = ? AND id_friend = ?
    `, [userId, friendId]);
    return (result as any).affectedRows > 0;
  } catch (error: any) {
    console.error('Error deleting friend display name:', error);
    throw error;
  }
};

