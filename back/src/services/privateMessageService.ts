import { db } from "../config/db";
import { PrivateMessage, PrivateMessageInput } from "../models/privateMessageModel";

export const createPrivateMessage = async (messageData: PrivateMessageInput): Promise<PrivateMessage> => {
  const { content, receiver_id, sender_id, is_read = false } = messageData;

  const query = `
    INSERT INTO private_messages (content, receiver_id, sender_id, is_read, sent_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const result = await db.execute(query, [content, receiver_id, sender_id, is_read]);
  const insertId = (result as any)[0].insertId;

  const newMessage = await getPrivateMessageById(insertId.toString());
  return newMessage;
};

export const getPrivateMessageById = async (id: string): Promise<PrivateMessage> => {
  const query = `
    SELECT pm.*,
           sender.username as sender_username,
           receiver.username as receiver_username
    FROM private_messages pm
    LEFT JOIN users sender ON pm.sender_id = sender.id_user
    LEFT JOIN users receiver ON pm.receiver_id = receiver.id_user
    WHERE pm.id_private_message = ?
  `;

  const [rows] = await db.execute(query, [id]);
  const messages = rows as PrivateMessage[];

  if (messages.length === 0) {
    throw new Error("Message not found");
  }

  return messages[0];
};

export const getMessagesBetweenUsers = async (user1Id: string, user2Id: string): Promise<PrivateMessage[]> => {
  const query = `
    SELECT pm.*,
           sender.username as sender_username,
           receiver.username as receiver_username
    FROM private_messages pm
    LEFT JOIN users sender ON pm.sender_id = sender.id_user
    LEFT JOIN users receiver ON pm.receiver_id = receiver.id_user
    WHERE (pm.sender_id = ? AND pm.receiver_id = ?)
       OR (pm.sender_id = ? AND pm.receiver_id = ?)
    ORDER BY pm.sent_at ASC
  `;

  const [rows] = await db.execute(query, [user1Id, user2Id, user2Id, user1Id]);
  return rows as PrivateMessage[];
};

export const getConversationsForUser = async (userId: string): Promise<any[]> => {
  const query = `
    SELECT DISTINCT
      CASE
        WHEN pm.sender_id = ? THEN pm.receiver_id
        ELSE pm.sender_id
      END as other_user_id,
      u.username as other_username,
      u.avatar_url as other_avatar_url,
      u.online_status as other_online_status,
      MAX(pm.sent_at) as last_message_time,
      COUNT(CASE WHEN pm.receiver_id = ? AND pm.is_read = 0 THEN 1 END) as unread_count
    FROM private_messages pm
    LEFT JOIN users u ON (
      CASE
        WHEN pm.sender_id = ? THEN pm.receiver_id
        ELSE pm.sender_id
      END = u.id_user
    )
    WHERE pm.sender_id = ? OR pm.receiver_id = ?
    GROUP BY other_user_id, u.username, u.avatar_url, u.online_status
    ORDER BY last_message_time DESC
  `;

  const [rows] = await db.execute(query, [userId, userId, userId, userId, userId]);
  return rows as any[];
};

export const markMessagesAsRead = async (senderId: string, receiverId: string): Promise<void> => {
  const query = `
    UPDATE private_messages
    SET is_read = 1
    WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
  `;

  await db.execute(query, [senderId, receiverId]);
};

export const deletePrivateMessage = async (id: string): Promise<void> => {
  const query = `DELETE FROM private_messages WHERE id_private_message = ?`;
  await db.execute(query, [id]);
};


