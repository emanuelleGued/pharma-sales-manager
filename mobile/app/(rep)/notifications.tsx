import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../src/theme/colors';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Notificações</Text>
        <Text style={styles.subtitle}>Você não tem novas notificações no momento.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
});