import api from './api';

export type NotificationType =
  | 'visit'
  | 'goal'
  | 'reminder'
  | 'success';

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  userId: number;
}

const NotificationService = {
  async getNotifications(userId: number) {
    const response = await api.get<NotificationResponse[]>(
      `/notifications?userId=${userId}`
    );

    return response.data;
  },

  async markAsRead(id: number) {
    await api.patch(`/notifications/${id}/read`);
  },
};

export default NotificationService;