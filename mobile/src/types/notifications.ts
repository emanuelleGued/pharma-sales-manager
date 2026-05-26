export type NotificationType = 'visit' | 'goal' | 'reminder' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  timeAgo: string;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'visit',
    title: 'Visita em 15 min com Dra. Ana Paula',
    timeAgo: 'Agora',
  },
  {
    id: '2',
    type: 'goal',
    title: 'Meta do dia: falta apenas 1 visita',
    timeAgo: 'Há 30 minutos',
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Lembrete: Registrar resultado da visita ao Dr. Marcos',
    timeAgo: 'Há 1 hora',
  },
  {
    id: '4',
    type: 'success',
    title: 'Você atingiu 80% da meta diária!',
    timeAgo: 'Há 2 horas',
  },
  {
    id: '5',
    type: 'visit',
    title: 'Próxima visita: Dr. Roberto Santos às 16h',
    timeAgo: 'Há 3 horas',
  },
];