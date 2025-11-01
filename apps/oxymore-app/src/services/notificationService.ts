import apiService from '../api/apiService';
import type { Notification, NotificationWithReadStatus, NotificationInput, NotificationType } from '../types/notification';

export const notificationService = {
  create: async (data: NotificationInput): Promise<Notification> => {
    try {
      const notification = await apiService.post('/notifications', data);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  createSimple: async (
    message: string, 
    type: NotificationType, 
    title?: string,
    userId?: string | null
  ): Promise<Notification> => {
    const defaultTitles = {
      success: 'Succès',
      alert: 'Alerte',
      info: 'Information',
      message: 'Message'
    };

    return notificationService.create({
      type,
      title: title || defaultTitles[type],
      text: message,
      id_user: userId !== undefined ? userId : null,
    });
  },

  createGlobal: async (
    message: string,
    type: NotificationType,
    title?: string
  ): Promise<Notification> => {
    return notificationService.createSimple(message, type, title, null);
  },

  createForUser: async (
    message: string,
    type: NotificationType,
    userId: string,
    title?: string
  ): Promise<Notification> => {
    return notificationService.createSimple(message, type, title, userId);
  },

  getAll: async (): Promise<Notification[]> => {
    try {
      const notifications = await apiService.get('/notifications');
      return notifications;
    } catch (error) {
      console.error('Error getting all notifications:', error);
      throw error;
    }
  },

  getByUserId: async (userId: string): Promise<NotificationWithReadStatus[]> => {
    try {
      const notifications = await apiService.get(`/notifications/user/${userId}`);
      return notifications;
    } catch (error) {
      console.error('Error getting notifications by user id:', error);
      throw error;
    }
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const response = await apiService.get(`/notifications/user/${userId}/unread-count`);
      return response.count || 0;
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
      return 0;
    }
  },

  markAsRead: async (userId: string, notificationId: string): Promise<void> => {
    if (!userId || !notificationId) {
      throw new Error(`Invalid parameters: userId=${userId}, notificationId=${notificationId}`);
    }
    const url = `/notifications/user/${userId}/mark-read/${notificationId}`;
    try {
      await apiService.post(url);
    } catch (error) {
      console.error('Error marking notification as read:', { url, userId, notificationId, error });
      throw error;
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await apiService.post(`/notifications/user/${userId}/mark-all-read`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  delete: async (notificationId: string): Promise<void> => {
    try {
      await apiService.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  deleteForUser: async (userId: string, notificationId: string): Promise<void> => {
    if (!userId || !notificationId) {
      throw new Error(`Invalid parameters: userId=${userId}, notificationId=${notificationId}`);
    }
    try {
      const url = `/notifications/user/${userId}/${notificationId}`;
      await apiService.delete(url);
    } catch (error) {
      console.error('Error deleting notification for user:', { userId, notificationId, error });
      throw error;
    }
  },
};