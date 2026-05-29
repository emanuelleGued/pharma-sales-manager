import { View, Text, StyleSheet, ScrollView,  Animated, Alert } from 'react-native';
import VisitCard from '../../src/components/VisitCard';
import { Header } from '../../src/components/Header';
import { colors } from '../../src/theme/colors';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useVisits } from '../../src/context/VisitContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DoctorService, { DoctorResponse } from '../../src/services/DoctorService';
import PerformanceService from '../../src/services/PerformanceService';

export default function RepHomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { visits, deleteVisit, loadVisits } = useVisits();
  const tabBarHeight = useBottomTabBarHeight();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONCLUIDA': return 'Realizada';
      case 'CANCELADA': return 'Cancelada';
      case 'REAGENDADA': return 'Reagendada';
      default: return 'Pendente';
    }
  };
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayString = getLocalDateString(new Date());
  const todayVisits = visits.filter(v => v.date === todayString);

  const [summary, setSummary] = useState({ completedVisits: 0, totalVisits: 10 });
  const progressPercent = summary.totalVisits > 0 ? (summary.completedVisits / summary.totalVisits) * 100 : 0;
  
  const [showToast, setShowToast] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastMessage = (params.toastMessage as string) || 'Visita registrada com sucesso!';
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadVisits();
      DoctorService.getAllDoctors()
        .then((data) => setDoctors(data))
        .catch(() => {});
      PerformanceService.getPerformanceSummary(1)
        .then((data) => setSummary(data))
        .catch(() => {});
    }, [])
  );

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
    <View style={styles.container}>
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

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 24 }]}>
        <View style={styles.progressContainer}>
           <Text style={styles.progressText}>{summary.completedVisits} / {summary.totalVisits}</Text>
           <Text style={styles.subText}>Visitas realizadas hoje</Text>
           <View style={styles.badgeMeta}>
              <Text style={styles.badgeText}>{Math.round(progressPercent)}% da meta</Text>
           </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roteiro de Hoje</Text>
          {todayVisits.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma visita registrada ainda. Vá na tela de adicionar para começar!
            </Text>
          ) : (
            todayVisits.map((visit) => {
              const doctor = doctors.find((d) => String(d.id) === String(visit.doctorId));

              return (
                <VisitCard
                  key={visit.id}
                  time={visit.time}
                  doctorName={doctor?.name || visit.doctorName || 'Médico não encontrado'}
                  specialty={doctor?.specialty || ''}
                  clinic={doctor?.clinicName || ''}
                  status={getStatusLabel(visit.status) as any}
                  onPress={() => router.push({ 
                    pathname: '/(rep)/visit-details', 
                    params: { id: visit.id } 
                  })}
                  onEdit={() => router.push({ pathname: '/(rep)/edit-visit', params: { id: visit.id } })}
                  onDelete={() => {
                    Alert.alert("Excluir", "Deseja excluir esta visita?", [
                      { text: "Não" },
                      { text: "Sim", onPress: () => deleteVisit(visit.id) }
                    ]);
                  }}
                />
              );
            }) 
          )}
        </View>
      </ScrollView>
    </View>
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
