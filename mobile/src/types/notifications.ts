export type NotificationType = 'visit' | 'goal' | 'reminder' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  timeAgo: string;
}