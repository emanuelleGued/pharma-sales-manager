import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../src/theme/colors';
import { Header } from '../../src/components/Header';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useVisits } from '../../src/context/VisitContext';
import { MOCK_DOCTORS } from '../../src/mocks/docktors';

export default function PerformanceScreen() {
  const router = useRouter();
  const { visits } = useVisits();

  // 1. Base de Médicos
  const totalDoctors = MOCK_DOCTORS.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const visitsThisMonth = visits.filter(v => {
    const d = new Date(v.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && v.status === 'completed';
  });
  
  const uniqueDoctorsVisited = new Set(visitsThisMonth.map(v => v.doctorId)).size;
  const doctorBasePercent = totalDoctors > 0 ? (uniqueDoctorsVisited / totalDoctors) * 100 : 0;

  // 2. Visitas da Semana
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; 
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  const weeklyVisits = Array(7).fill(0);
  
  visits.forEach(v => {
    if (v.status === 'completed') {
      const vDate = new Date(v.date + 'T12:00:00'); 
      const diffTime = vDate.getTime() - startOfWeek.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        weeklyVisits[diffDays]++;
      }
    }
  });

  const maxWeeklyVisits = Math.max(...weeklyVisits, 12); 

  // 3. Progresso Mensal
  const monthGoal = 200; 
  const monthProgress = visitsThisMonth.length;
  const monthPercent = (monthProgress / monthGoal) * 100;

  // 4. Projeção do Mês
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysPassed = today.getDate();
  const projectedVisits = daysPassed > 0 ? Math.round((monthProgress / daysPassed) * daysInMonth) : 0;
  const projectedPercent = Math.round((projectedVisits / monthGoal) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        onProfileClick={() => router.push('../profile')} 
        onNotificationsClick={() => router.push('../notifications')} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Base de Médicos */}
        <View style={styles.baseCard}>
           <View style={styles.baseTop}>
             <View style={styles.baseInfo}>
               <Text style={styles.baseSubtitle}>Base de Médicos</Text>
               <Text style={styles.baseTitle}>{uniqueDoctorsVisited} <Text style={styles.baseTitleSmall}>/ {totalDoctors}</Text></Text>
               <Text style={styles.baseDesc}>Doutores visitados este mês</Text>
             </View>
             <View style={styles.avatarContainer}>
               <Feather name="user" size={32} color="#854d0e" />
             </View>
           </View>
           <View style={styles.progressBarBackground}>
             <View style={[styles.progressBarFill, { width: `${doctorBasePercent}%` }]} />
           </View>
        </View>

        {/* Visitas da Semana */}
        <Text style={styles.sectionTitle}>Visitas Esta Semana</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {weeklyVisits.map((count, index) => {
              const heightPercent = Math.max((count / maxWeeklyVisits) * 100, 10);
              const isToday = index === dayOfWeek;
              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View style={[
                      styles.barFill, 
                      { height: `${heightPercent}%`, backgroundColor: isToday || count > 0 ? colors.secondary : '#94A3B8' }
                    ]} />
                  </View>
                  <Text style={styles.barCount}>{count}</Text>
                  <Text style={styles.barLabel}>{weekDays[index]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Progresso Mensal */}
        <Text style={styles.sectionTitle}>Progresso Mensal</Text>
        <View style={styles.monthCard}>
           <View style={styles.monthTop}>
             <View style={styles.monthTarget}>
               <Feather name="target" size={20} color={colors.secondary} />
               <Text style={styles.monthTargetText}>Meta Mensal</Text>
             </View>
             <Text style={styles.monthValue}>{monthProgress} <Text style={styles.monthValueSmall}>/ {monthGoal}</Text></Text>
           </View>
           <View style={styles.monthBarBackground}>
             <View style={[styles.monthBarFill, { width: `${Math.min(monthPercent, 100)}%` }]} />
           </View>
           <Text style={styles.monthPercentText}>
             <Text style={styles.monthPercentHighlight}>{Math.round(monthPercent)}%</Text> concluído
           </Text>
        </View>

        {/* Projeção do Mês */}
        <View style={styles.projectionCard}>
          <View style={styles.projectionIcon}>
             <Feather name="target" size={24} color={colors.secondary} />
          </View>
          <View style={styles.projectionInfo}>
            <Text style={styles.projectionTitle}>Projeção do Mês</Text>
            <Text style={styles.projectionDesc}>
              Neste ritmo, você fechará o mês com <Text style={styles.projectionHighlight}>{projectedPercent}%</Text> da meta
            </Text>
          </View>
        </View>

        {/* Últimas Conquistas */}
        <View style={styles.achievementsHeader}>
           <Feather name="award" size={20} color={colors.primary} />
           <Text style={styles.sectionTitleAchievements}>Últimas Conquistas</Text>
        </View>
        
        <View style={styles.achievementCard}>
          <View style={styles.achievementIconBg}>
            <Feather name="award" size={20} color={colors.primary} />
          </View>
          <Text style={styles.achievementText}>5 dias consecutivos batendo a meta</Text>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementIconBg}>
            <Feather name="award" size={20} color={colors.primary} />
          </View>
          <Text style={styles.achievementText}>Recorde pessoal: 12 visitas em um dia</Text>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementIconBg}>
            <Feather name="award" size={20} color={colors.primary} />
          </View>
          <Text style={styles.achievementText}>100% de check-in dentro do horário</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  baseCard: {
    backgroundColor: '#991B1B', 
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  baseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  baseInfo: { flex: 1 },
  baseSubtitle: { color: '#FECACA', fontSize: 14, marginBottom: 4 },
  baseTitle: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', marginBottom: 4 },
  baseTitleSmall: { fontSize: 24, fontWeight: '700' },
  baseDesc: { color: '#FFFFFF', fontSize: 13, marginBottom: 16 },
  avatarContainer: {
    backgroundColor: '#FEF3C7', 
    width: 60, height: 60,
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  },
  progressBarBackground: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16, marginTop: 8 },
  
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    paddingBottom: 10,
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barWrapper: { alignItems: 'center', width: 30 },
  barBackground: {
    height: 60, width: 36,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  barCount: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  barLabel: { fontSize: 12, color: colors.textSecondary },

  monthCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  monthTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  monthTarget: { flexDirection: 'row', alignItems: 'center' },
  monthTargetText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#1E293B' },
  monthValue: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  monthValueSmall: { fontSize: 20, fontWeight: '700' },
  monthBarBackground: { height: 12, backgroundColor: '#F1F5F9', borderRadius: 6, marginBottom: 12 },
  monthBarFill: { height: '100%', backgroundColor: colors.secondary, borderRadius: 6 },
  monthPercentText: { fontSize: 14, color: colors.textSecondary },
  monthPercentHighlight: { color: colors.secondary, fontWeight: 'bold' },

  projectionCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  projectionIcon: {
    backgroundColor: '#FFFFFF',
    width: 48, height: 48,
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  projectionInfo: { flex: 1 },
  projectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  projectionDesc: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  projectionHighlight: { fontWeight: 'bold' },

  achievementsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitleAchievements: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginLeft: 8 },
  
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementIconBg: {
    backgroundColor: '#FEE2E2',
    width: 40, height: 40,
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  achievementText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
});