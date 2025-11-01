import { apiService } from '../api/apiService';

export interface NotificationAdmin {
  id_notification_admin: string;
  type: 'message' | 'success' | 'alert';
  title: string;
  text: string;
  created_at: string;
  read_at?: string | null;
  is_read: boolean;
}

export const notificationAdminService = {
  getAll: async (): Promise<NotificationAdmin[]> => {
    return apiService.get<NotificationAdmin[]>('/admin/notifications');
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiService.get<{ count: number }>('/admin/notifications/unread-count');
    return response.count;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiService.post(`/admin/notifications/${notificationId}/mark-read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await apiService.post('/admin/notifications/mark-all-read', {});
  },

  delete: async (notificationId: string): Promise<void> => {
    await apiService.delete(`/admin/notifications/${notificationId}`);
  },
};

