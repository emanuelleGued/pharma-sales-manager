import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { VisitCard } from '../../src/components/VisitCard'; 
import { Header } from '../../src/components/Header'; 
import { colors } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import { useVisits } from '../../src/context/VisitContext'; 

export default function RepHomeScreen() {
  const router = useRouter();
  
  // Substituímos o array fixo pelas visitas que vêm do Contexto!
  const { visits } = useVisits();
  const todayString = new Intl.DateTimeFormat('pt-BR').format(new Date());
  const todayVisits = visits.filter(v => v.date === todayString);
  const completedToday = todayVisits.filter(v => v.status === 'completed').length;
  const progressPercent = (completedToday / 10) * 100;

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
          
          {/* Se não houver visitas, mostra um textinho amigável */}
          {visits.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma visita registrada ainda. Vá na tela de adicionar para começar!
            </Text>
          ) : (
            /* Se houver, mapeia as visitas do Contexto para o seu VisitCard */
            visits.map((visit) => (
              <VisitCard
                key={visit.id}
                time={visit.time}
                doctorName={visit.doctor.name}       // Puxando de visit.doctor
                specialty={visit.doctor.specialty}   // Puxando de visit.doctor
                clinic={visit.doctor.clinicName}     // Puxando de visit.doctor
              />
            ))
          )}
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
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});
