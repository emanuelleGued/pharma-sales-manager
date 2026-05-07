import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import VisitCard from '../../src/components/VisitCard';
import { MOCK_DOCTORS } from '@/src/mocks/doctors';
import { useVisits } from '../../src/context/VisitsContext'; // ← novo

export default function AgendaScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const { visits, deleteVisit } = useVisits(); // ← novo (removeu MOCK_VISITS)
  const router = useRouter(); // ← novo

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
        date: d.toISOString().split('T')[0],
      });
    }

    return week;
  };

  const week = getWeekDays(currentDate);

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const filteredVisits = visits // ← era MOCK_VISITS
    .filter((visit) => visit.date === selectedDate)
    .map((visit) => {
      const doctor = MOCK_DOCTORS.find((doc) => doc.id === visit.doctorId);
      return { ...visit, doctor };
    });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER COM MÊS */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevWeek}>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {currentDate.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity onPress={nextWeek}>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* SEMANA */}
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

      {/* LISTA */}
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
            filteredVisits.map(({ id, time, doctor }) => (
              <VisitCard
                key={id}
                time={time}
                doctorName={doctor?.name || ''}
                specialty={doctor?.specialty || ''}
                clinic={doctor?.clinicName || ''}
                onPress={() => router.push({ pathname: '/(rep)/visit_detail', params: { id } })}
                onEdit={() => router.push({ pathname: '/(rep)/edit_visit', params: { id } })}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
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
});