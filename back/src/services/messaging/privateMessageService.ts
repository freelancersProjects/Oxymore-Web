import { db } from "../../config/db";
import { PrivateMessage, PrivateMessageInput } from "../../interfaces/messaging/privateMessageInterfaces";
import crypto from "crypto";

export const createPrivateMessage = async (messageData: PrivateMessageInput): Promise<PrivateMessage> => {
  const { content, receiver_id, sender_id, is_read = false, reply_to } = messageData;
  const id_private_message = crypto.randomUUID();

  const query = `
    INSERT INTO private_messages (id_private_message, content, reply_to, receiver_id, sender_id, is_read, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  await db.execute(query, [id_private_message, content, reply_to || null, receiver_id, sender_id, is_read]);

  const newMessage = await getPrivateMessageById(id_private_message);
  return newMessage;
};

export const getPrivateMessageById = async (id: string): Promise<PrivateMessage> => {
  const query = `
    SELECT pm.*,
           sender.username as sender_username,
           receiver.username as receiver_username,
           reply_msg.content as reply_content,
           reply_msg.sender_id as reply_sender_id,
           reply_user.username as reply_username
    FROM private_messages pm
    LEFT JOIN user sender ON pm.sender_id = sender.id_user
    LEFT JOIN user receiver ON pm.receiver_id = receiver.id_user
    LEFT JOIN private_messages reply_msg ON pm.reply_to = reply_msg.id_private_message
    LEFT JOIN user reply_user ON reply_msg.sender_id = reply_user.id_user
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
  if (!user1Id || !user2Id) {
    throw new Error("Both user IDs are required");
  }

  const query = `
    SELECT pm.*,
           sender.username as sender_username,
           receiver.username as receiver_username,
           sender.avatar_url as sender_avatar_url,
           receiver.avatar_url as receiver_avatar_url,
           reply_msg.content as reply_content,
           reply_msg.sender_id as reply_sender_id,
           reply_user.username as reply_username
    FROM private_messages pm
    LEFT JOIN user sender ON pm.sender_id = sender.id_user
    LEFT JOIN user receiver ON pm.receiver_id = receiver.id_user
    LEFT JOIN private_messages reply_msg ON pm.reply_to = reply_msg.id_private_message
    LEFT JOIN user reply_user ON reply_msg.sender_id = reply_user.id_user
    WHERE (pm.sender_id = ? AND pm.receiver_id = ?)
       OR (pm.sender_id = ? AND pm.receiver_id = ?)
    ORDER BY pm.sent_at ASC
  `;

  const [rows] = await db.execute(query, [user1Id, user2Id, user2Id, user1Id]);
  return rows as PrivateMessage[];
};

export const getConversationsForUser = async (userId: string): Promise<any[]> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const query = `
    SELECT 
      CASE
        WHEN pm.sender_id = ? THEN pm.receiver_id
        ELSE pm.sender_id
      END as other_user_id,
      MAX(u.username) as other_username,
      MAX(u.avatar_url) as other_avatar_url,
      MAX(u.online_status) as other_online_status,
      MAX(pm.sent_at) as last_message_time,
      SUBSTRING_INDEX(GROUP_CONCAT(pm.content ORDER BY pm.sent_at DESC), ',', 1) as last_message_content,
      COUNT(CASE WHEN pm.receiver_id = ? AND pm.is_read = 0 THEN 1 END) as unread_count
    FROM private_messages pm
    LEFT JOIN user u ON (
      CASE
        WHEN pm.sender_id = ? THEN pm.receiver_id
        ELSE pm.sender_id
      END = u.id_user
    )
    WHERE (pm.sender_id = ? OR pm.receiver_id = ?)
      AND (pm.sender_id != pm.receiver_id)
    GROUP BY 
      CASE
        WHEN pm.sender_id = ? THEN pm.receiver_id
        ELSE pm.sender_id
      END
    ORDER BY last_message_time DESC
  `;

  const [rows] = await db.execute(query, [userId, userId, userId, userId, userId, userId]);
  
  // Récupérer les display_names séparément pour chaque conversation
  const rowsWithDisplayNames = await Promise.all((rows as any[]).map(async (row) => {
    const displayNameQuery = `
      SELECT fdn.display_name
      FROM friends f
      LEFT JOIN friend_display_names fdn ON fdn.id_friend COLLATE utf8mb4_unicode_ci = f.id_friend COLLATE utf8mb4_unicode_ci 
        AND fdn.id_user COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci
      WHERE ((f.id_user_sender = ? AND f.id_user_receiver = ?)
         OR (f.id_user_receiver = ? AND f.id_user_sender = ?))
        AND f.status = 'accepted'
      LIMIT 1
    `;
    const [displayNameRows] = await db.execute(displayNameQuery, [userId, userId, row.other_user_id, userId, row.other_user_id]);
    const displayName = (displayNameRows as any[])[0]?.display_name || null;
    return {
      ...row,
      other_display_name: displayName
    };
  }));
  
  return rowsWithDisplayNames.map(row => ({
    other_user_id: row.other_user_id,
    other_username: row.other_username,
    other_display_name: row.other_display_name,
    other_avatar_url: row.other_avatar_url,
    other_online_status: row.other_online_status,
    last_message: row.last_message_content ? {
      content: row.last_message_content,
      sent_at: row.last_message_time
    } : null,
    unread_count: row.unread_count || 0
  }));
};

export const markMessagesAsRead = async (senderId: string, receiverId: string): Promise<void> => {
  const query = `
    UPDATE private_messages
    SET is_read = 1
    WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
  `;

  await db.execute(query, [senderId, receiverId]);
};

export const updatePrivateMessage = async (id: string, content: string): Promise<PrivateMessage> => {
  const query = `
    UPDATE private_messages
    SET content = ?, updated_at = NOW()
    WHERE id_private_message = ?
  `;

  await db.execute(query, [content, id]);
  return await getPrivateMessageById(id);
};

export const deletePrivateMessage = async (id: string): Promise<void> => {
  const query = `DELETE FROM private_messages WHERE id_private_message = ?`;
  await db.execute(query, [id]);
};



