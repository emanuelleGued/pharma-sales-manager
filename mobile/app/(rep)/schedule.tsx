import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import VisitCard from '../../src/components/VisitCard';
import DoctorService, { DoctorResponse } from '../../src/services/DoctorService';
import { useVisits } from '../../src/context/VisitContext'; 

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString(new Date())
  );
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const { visits, deleteVisit } = useVisits(); 
  const router = useRouter(); 
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);

  useEffect(() => {
    DoctorService.getAllDoctors()
      .then((data) => setDoctors(data))
      .catch((err) => console.error('Erro ao buscar lista de médicos da agenda:', err));
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONCLUIDA': return 'Realizada';
      case 'CANCELADA': return 'Cancelada';
      case 'REAGENDADA': return 'Reagendada';
      default: return 'Pendente'; // AGENDADA
    }
  };

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      week.push({
        label: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()],
        day: d.getDate(),
        date: getLocalDateString(d),
      });
    }

    return week;
  };

  const week = getWeekDays(currentDate);

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        day: i,
        date: getLocalDateString(d),
      });
    }
    return days;
  };

  const monthDays = getMonthDays(currentDate);

  const nextDate = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') {
      next.setDate(currentDate.getDate() + 7);
    } else {
      next.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(next);
  };

  const prevDate = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'week') {
      prev.setDate(currentDate.getDate() - 7);
    } else {
      prev.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(prev);
  };

  const filteredVisits = (visits || [])
    .filter((visit) => visit.date === selectedDate)
    .map((visit) => {
      const doctor = doctors.find((doc) => String(doc.id) === String(visit.doctorId));
      return { ...visit, doctor };
  });

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={prevDate}>
            <Text style={styles.arrow}>{'<'}</Text>
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {currentDate.toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          <TouchableOpacity onPress={nextDate}>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'month' && styles.toggleButtonActive]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.toggleText, viewMode === 'month' && styles.toggleTextActive]}>Mês</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'week' ? (
          <View style={styles.weekContainer}>
            {week.map((item) => {
              const isSelected = item.date === selectedDate;
              return (
                <TouchableOpacity
                  key={item.date}
                  style={[styles.dayBox, isSelected && styles.selectedDay]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[styles.dayLabel, isSelected && styles.selectedText]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.monthContainer}>
            <View style={styles.monthHeaderRow}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <Text key={d} style={styles.monthDayHeader}>{d}</Text>
              ))}
            </View>
            <View style={styles.monthGrid}>
              {monthDays.map((item, index) => {
                if (!item) return <View key={`empty-${index}`} style={styles.monthDayBox} />;
                
                const isSelected = item.date === selectedDate;
                const isToday = item.date === getLocalDateString(new Date());
                const hasVisit = (visits || []).some(v => v.date === item.date);

                return (
                  <TouchableOpacity
                    key={item.date}
                    style={[
                      styles.monthDayBox,
                      isSelected && !isToday && styles.monthSelectedDay,
                      isToday && styles.monthToday,
                    ]}
                    onPress={() => setSelectedDate(item.date)}
                  >
                    <Text
                      style={[
                        styles.monthDayNumber,
                        isSelected && !isToday && styles.monthSelectedText,
                        isToday && styles.monthTodayText,
                      ]}
                    >
                      {item.day}
                    </Text>
                    {hasVisit && !isToday && (
                      <View style={styles.visitDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>



      <View style={styles.listContainer}>
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          style={{ overflow: 'visible' }}
        >
          <Text style={styles.title}>
            Visitas do dia ({filteredVisits.length})
          </Text>

          {filteredVisits.length > 0 ? (
            filteredVisits.map(({ id, time, doctor, status }) => (
              <VisitCard
                key={id}
                time={time}
                doctorName={doctor?.name || ''}
                specialty={doctor?.specialty || ''}
                clinic={doctor?.clinicName || ''}
                status={getStatusLabel(status) as any}
                onPress={() => router.push({ pathname: '/(rep)/schedule-details', params: { id } })}
                onEdit={() => router.push({ pathname: '/(rep)/edit-visit', params: { id } })}
                onDelete={() =>
                  Alert.alert('Excluir visita', 'Tem certeza?', [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', style: 'destructive', onPress: () => deleteVisit(id) },
                  ])
                }
              />
            ))
          ) : (
            <Text style={styles.empty}>Nenhuma visita</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendarWrapper: {
    zIndex: 10,
    backgroundColor: colors.background,
    paddingBottom: 8,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  arrow: {
    fontSize: 18,
    color: colors.text,
  },

  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },

  dayBox: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
  },

  selectedDay: {
    backgroundColor: colors.primary,
  },

  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  selectedText: {
    color: '#fff',
  },

  list: {
    padding: 16,
    paddingBottom: 100,
    overflow: 'visible',
  },

  listContainer: {
    flex: 1,
    overflow: 'visible',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },

  empty: {
    color: colors.textSecondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#C8102E',
  },
  monthContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthDayHeader: {
    width: '14%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  monthDayBox: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 4,
  },
  monthSelectedDay: {
    borderWidth: 2,
    borderColor: '#C8102E',
  },
  monthToday: {
    backgroundColor: '#00A896',
  },
  monthDayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  monthSelectedText: {
    color: '#C8102E',
    fontWeight: 'bold',
  },
  monthTodayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  visitDot: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C8102E',
  },
});