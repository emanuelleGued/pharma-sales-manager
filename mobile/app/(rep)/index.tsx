import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { VisitCard } from '../../src/components/VisitCard'; 
import { Header } from '../../src/components/Header'; 
import { colors } from '../../src/theme/colors';
import { useRouter } from 'expo-router';

export default function RepHomeScreen() {
  const router = useRouter();
  const visits = [
    { id: '1', time: '10:00', name: 'Dr. Marcos', spec: 'Cardiologista', clinic: 'Clínica Coração Saudável' },
    { id: '2', time: '14:30', name: 'Dra. Ana Paula', spec: 'Pediatra', clinic: 'Centro Pediátrico ABC' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Usando o Componente Header de verdade */}
      <Header 
        onProfileClick={() => router.push('../profile')} 
        onNotificationsClick={() => router.push('../notifications')} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
           <Text style={styles.progressText}>4 / 10</Text>
           <Text style={styles.subText}>Visitas realizadas hoje</Text>
           <View style={styles.badgeMeta}>
              <Text style={styles.badgeText}>40% da meta</Text>
           </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roteiro de Hoje</Text>
          {visits.map((visit) => (
            <VisitCard
              key={visit.id}
              time={visit.time}
              doctorName={visit.name}
              specialty={visit.spec}
              clinic={visit.clinic}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  progressText: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
  },
  subText: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  badgeMeta: {
    backgroundColor: colors.successBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  badgeText: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
});