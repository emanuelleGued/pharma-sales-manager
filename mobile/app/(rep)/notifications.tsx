import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { ApiNotification, Notification, NotificationType } from '../../src/types/notifications';
import api from '../../src/services/api';

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

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiNotification[]>('/notifications', {
          params: { userId: 1, role: 'REPRESENTATIVE' },
        });
        const mapped: Notification[] = response.data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: mapType(n.type),
          timeAgo: formatTimeAgo(n.createdAt),
        }));
        setNotifications(mapped);
      } catch (err) {
        console.warn('Erro ao carregar notificações:', err);
        setError('Erro ao carregar notificações');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case 'visit':
        return { icon: 'clock', color: '#38A185' };
      case 'goal':
        return { icon: 'target', color: colors.primary };
      case 'reminder':
        return { icon: 'map-pin', color: '#F5A623' };
      case 'success':
        return { icon: 'check-circle', color: '#38A185' };
      default:
        return { icon: 'bell', color: colors.textSecondary };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Feather name="x" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && notifications.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma notificação encontrada.</Text>
        )}

        {notifications.map((notif) => {
          const { icon, color } = getNotificationStyle(notif.type);
          return (
            <View key={notif.id} style={styles.card}>
              <View style={styles.iconContainer}>
                {/* @ts-ignore */}
                <Feather name={icon} size={20} color={color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{notif.title}</Text>
                {notif.message ? <Text style={styles.cardMessage}>{notif.message}</Text> : null}
                <Text style={styles.cardTime}>{notif.timeAgo}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.text },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: { marginRight: 16, marginTop: 2 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  cardMessage: { fontSize: 14, color: colors.text, marginBottom: 4 },
  cardTime: { fontSize: 13, color: colors.textSecondary },
  errorText: { textAlign: 'center', color: 'red', marginTop: 40 },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});