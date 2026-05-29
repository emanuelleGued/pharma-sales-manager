import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { NotificationOption } from '../../src/types/notificationSettings';
import api from '../../src/services/api';

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/notifications/settings');
        setNotifications(response.data);
      } catch {
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleNotification = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target) return;

    const updated = { ...target, enabled: !target.enabled };

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? updated : n))
    );

    try {
      await api.patch(`/api/notifications/settings/${id}`, { enabled: updated.enabled });
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? target : n))
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(rep)/profile')}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>Gerencie suas preferências de notificação</Text>

        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.list}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.card}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{notification.title}</Text>
                <Text style={styles.cardDescription}>{notification.description}</Text>
              </View>
              <Switch
                trackColor={{ false: '#E5E7EB', true: '#00A896' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#E5E7EB"
                onValueChange={() => toggleNotification(notification.id)}
                value={notification.enabled}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  content: { padding: 24 },
  description: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  list: { gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
  },
  textContainer: { flex: 1, marginRight: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  cardDescription: { fontSize: 13, color: colors.textSecondary },
  errorText: { textAlign: 'center', color: 'red', marginBottom: 16 },
});