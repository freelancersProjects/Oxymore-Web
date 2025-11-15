import apiService from "../api/apiService";
import type { PrivateMessage, Conversation } from "../types/privateMessage";

export const privateMessageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiService.get('/private-messages/conversations');
    return response;
  },

  getMessages: async (friendId: string): Promise<PrivateMessage[]> => {
    const response = await apiService.get(`/private-messages/${friendId}`);
    return response;
  },

  sendMessage: async (content: string, receiverId: string, replyTo?: string): Promise<PrivateMessage> => {
    const response = await apiService.post('/private-messages', {
      content,
      receiver_id: receiverId,
      reply_to: replyTo
    });
    return response;
  },

  updateMessage: async (messageId: string, content: string): Promise<PrivateMessage> => {
    const response = await apiService.put(`/private-messages/${messageId}`, {
      content
    });
    return response;
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await apiService.delete(`/private-messages/${messageId}`);
  }
};

