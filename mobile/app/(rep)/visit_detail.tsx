import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useVisits } from '../../src/context/VisitsContext';
import { MOCK_DOCTORS } from '../../src/mocks/doctors';

export default function VisitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { visits, deleteVisit } = useVisits();
  const router = useRouter();

  const visit = visits.find((v) => v.id === id);
  const doctor = MOCK_DOCTORS.find((d) => d.id === visit?.doctorId);

  if (!visit || !doctor) return null;

  const handleDelete = () => {
    Alert.alert('Excluir visita', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => { deleteVisit(visit.id); router.push('/(rep)/schedule'); },
      },
    ]);
  };

  const formattedDate = new Date(visit.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(rep)/schedule')}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Visita</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Médico */}
      <View style={styles.card}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Feather name="map-pin" size={16} color={colors.secondary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.clinicName}>{doctor.clinicName}</Text>
            <Text style={styles.location}>{doctor.location}</Text>
          </View>
        </View>
      </View>

      {/* Data & Horário */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data & Horário</Text>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Feather name="calendar" size={18} color={colors.secondary} />
          </View>
          <View style={{ marginLeft: 8, marginRight: 24 }}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
          <View style={styles.iconCircle}>
            <Feather name="clock" size={18} color={colors.secondary} />
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.label}>Horário</Text>
            <Text style={styles.value}>{visit.time}</Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(rep)/edit_visit', params: { id: visit.id } })}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 16,
    borderBottomWidth: 1, borderColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  card: {
    margin: 16, marginBottom: 0, padding: 16,
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  specialty: { fontSize: 14, color: colors.secondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  clinicName: { fontSize: 15, fontWeight: '600', color: colors.text },
  location: { fontSize: 13, color: colors.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  iconCircle: { backgroundColor: colors.successBackground, padding: 10, borderRadius: 50 },
  label: { fontSize: 11, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 32 },
  editText: { fontSize: 16, fontWeight: 'bold', color: colors.secondary },
  deleteText: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
});