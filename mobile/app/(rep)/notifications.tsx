import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { mockNotifications, NotificationType } from '../../src/mocks/notifications';

export default function NotificationsScreen() {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com o botão de fechar */}
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()} 
        >
          <Feather name="x" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Lista de Notificações */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mockNotifications.map((notif) => {
          const { icon, color } = getNotificationStyle(notif.type);
          
          return (
            <View key={notif.id} style={styles.card}>
              <View style={styles.iconContainer}>
                {/* @ts-ignore */}
                <Feather name={icon} size={20} color={color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{notif.title}</Text>
                <Text style={styles.cardTime}>{notif.timeAgo}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: colors.text 
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});