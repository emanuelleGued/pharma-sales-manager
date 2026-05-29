export type NotificationType = 'visit' | 'goal' | 'reminder' | 'success';

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'VISIT' | 'GOAL' | 'REMINDER' | 'SUCCESS';
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
}