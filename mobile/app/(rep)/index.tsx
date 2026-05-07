import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated } from 'react-native';
import { VisitCard } from '../../src/components/VisitCard'; 
import { Header } from '../../src/components/Header'; 
import { colors } from '../../src/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVisits } from '../../src/context/VisitContext';
import { useEffect, useState, useRef } from 'react'; 
import { Feather } from '@expo/vector-icons'; 

export default function RepHomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { visits } = useVisits();
  const todayString = new Intl.DateTimeFormat('pt-BR').format(new Date());
  const todayVisits = visits.filter(v => v.date === todayString);

  const completedToday = todayVisits.filter(v => v.status === 'completed').length;
  const progressPercent = (completedToday / 10) * 100;
  
  const [showToast, setShowToast] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastMessage = (params.toastMessage as string) || 'Visita registrada com sucesso!';

  useEffect(() => {
    if (params.success) { 
      setShowToast(true);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowToast(false);
          router.setParams({ success: undefined });
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [params.success]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Usando o Componente Header de verdade */}
      {showToast && (
        <Animated.View style={[styles.toastWrapper, { opacity: fadeAnim }]}>
          <View style={styles.toast}>
            <View style={styles.iconCircle}>
              <Feather name="check" size={14} color="#00A896" />
            </View>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}
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
          {todayVisits.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma visita registrada ainda. Vá na tela de adicionar para começar!
            </Text>
          ) : (
            todayVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                time={visit.time}
                doctorName={visit.doctor.name}       
                specialty={visit.doctor.specialty}
                clinic={visit.doctor.clinicName}
                onPress={() => router.push('/(rep)/visit-details')}
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
  },
  toastWrapper: {
    position: 'absolute',
    top: 100, 
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999, 
  },
  toast: {
    backgroundColor: '#00A896',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconCircle: {
    backgroundColor: '#FFF',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  toastText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
