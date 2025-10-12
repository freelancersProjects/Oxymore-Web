import { Request, Response } from "express";
import { PrivateMessageInput } from "../../models/privateMessageModel";
import {
  createPrivateMessage,
  getPrivateMessageById,
  getMessagesBetweenUsers,
  getConversationsForUser,
  markMessagesAsRead,
  deletePrivateMessage
} from "../../services/privateMessageService";

export const sendPrivateMessage = async (req: Request, res: Response) => {
  try {
    const { content, receiver_id } = req.body;
    const sender_id = (req as any).user.id_user;

    if (!content || !receiver_id) {
      return res.status(400).json({ error: "Content and receiver_id are required" });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: "Message content cannot exceed 500 characters" });
    }

    const messageData: PrivateMessageInput = {
      content: content.trim(),
      receiver_id,
      sender_id,
      is_read: false
    };

    const newMessage = await createPrivateMessage(messageData);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending private message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPrivateMessages = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.params;
    const userId = (req as any).user.id_user;

    const messages = await getMessagesBetweenUsers(userId, friendId);

    // Marquer les messages comme lus
    await markMessagesAsRead(friendId, userId);

    res.json(messages);
  } catch (error) {
    console.error("Error getting private messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id_user;
    const conversations = await getConversationsForUser(userId);
    res.json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPrivateMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await getPrivateMessageById(id);
    res.json(message);
  } catch (error) {
    console.error("Error getting private message:", error);
    res.status(404).json({ error: "Message not found" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id_user;

    // Vérifier que l'utilisateur est le propriétaire du message
    const message = await getPrivateMessageById(id);
    if (message.sender_id !== userId) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    await deletePrivateMessage(id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


