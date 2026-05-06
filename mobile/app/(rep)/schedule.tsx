import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { colors } from '../../src/theme/colors';
import VisitCard from '../../src/components/VisitCard';

export default function AgendaScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

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

  const visits = [
    {
      id: 1,
      name: 'Dr. Carlos Mendes',
      specialty: 'Clínico Geral',
      clinic: 'Clínica Vida',
      date: '2026-04-18',
      time: '09:00',
    },
    {
      id: 2,
      name: 'Dra. Fernanda Lima',
      specialty: 'Pediatra',
      clinic: 'Clínica Infantil',
      date: '2026-04-18',
      time: '10:30',
    },
  ];

  const filteredVisits = visits.filter(
    (visit) => visit.date === selectedDate
  );

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
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.label}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LISTA */}
      <View style={styles.list}>
        <Text style={styles.title}>Visitas do dia</Text>

        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              time={visit.time}
              doctorName={visit.name}
              specialty={visit.specialty}
              clinic={visit.clinic}
              onPress={() => console.log('Abrir visita', visit.id)}
            />
          ))
        ) : (
          <Text style={styles.empty}>Nenhuma visita</Text>
        )}
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