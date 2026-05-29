import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import api from '../services/api';
import {
  ApiNotification,
  Notification,
  NotificationType,
} from '../types/notifications';

const POLL_INTERVAL_MS = 30_000;
const USER_ID = 1;
const ROLE = 'REPRESENTATIVE';

function formatTimeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  const diffSec = Math.floor((Date.now() - created) / 1000);
  if (diffSec < 60) return 'agora mesmo';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `há ${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `há ${diffDay}d`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

function mapType(t: ApiNotification['type']): NotificationType {
  switch (t) {
    case 'VISIT': return 'visit';
    case 'GOAL': return 'goal';
    case 'REMINDER': return 'reminder';
    case 'SUCCESS': return 'success';
    default: return 'visit';
  }
}

interface NotificationContextData {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const response = await api.get<ApiNotification[]>('/notifications', {
        params: { userId: USER_ID, role: ROLE },
      });
      const mapped: Notification[] = response.data.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: mapType(n.type),
        timeAgo: formatTimeAgo(n.createdAt),
      }));
      setNotifications(mapped);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    } catch (err) {
      console.warn('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setUnreadCount(0);
    try {
      await api.patch('/notifications/read-all', null, {
        params: { userId: USER_ID, role: ROLE },
      });
    } catch (err) {
      console.warn('Erro ao marcar notificações como lidas:', err);
      refresh();
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, refresh, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
