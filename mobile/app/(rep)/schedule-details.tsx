import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useVisits } from '../../src/context/VisitContext';
import { MOCK_DOCTORS } from '../../src/mocks/docktors';

export default function ScheduleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { visits = [], deleteVisit } = useVisits();
  const router = useRouter();

  const visit = visits?.find((v) => v.id === id);
  const doctor = MOCK_DOCTORS.find((d) => d.id === visit?.doctorId);

  if (!visit || !doctor) return null;

  const handleDelete = () => {
    Alert.alert('Excluir visita', 'Tem certeza que deseja remover este agendamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => { 
          deleteVisit(visit.id); 
          router.replace('/(rep)/schedule'); 
        },
      },
    ]);
  };

  const formattedDate = new Date(visit.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Visita</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do Médico */}
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

        {/* Card de Data/Hora */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data & Horário</Text>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Feather name="calendar" size={18} color={colors.secondary} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.label}>DATA</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>
            <View style={styles.iconCircle}>
              <Feather name="clock" size={18} color={colors.secondary} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.label}>HORÁRIO</Text>
              <Text style={styles.value}>{visit.time}</Text>
            </View>
          </View>
        </View>

        {/* Botões de Ação Padronizados com Bordas */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.outlineButton} 
            onPress={() => router.push({ pathname: '/(rep)/edit-visit', params: { id: visit.id } })}
          >
            <Feather name="edit-2" size={18} color={colors.secondary} />
            <Text style={styles.outlineButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.outlineButton, { borderColor: '#E74C3C' }]} 
            onPress={handleDelete}
          >
            <Feather name="trash-2" size={18} color="#E74C3C" />
            <Text style={[styles.outlineButtonText, { color: '#E74C3C' }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1, 
    borderColor: colors.border,
  },
  backButton: {
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    padding: 20,
    backgroundColor: '#fff', 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: colors.border,
    marginBottom: 16,
  },
  doctorName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  specialty: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  clinicName: { fontSize: 16, fontWeight: '600', color: colors.text },
  location: { fontSize: 14, color: colors.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  iconCircle: { backgroundColor: '#F0F9F7', padding: 10, borderRadius: 12 },
  label: { fontSize: 11, color: colors.textSecondary, letterSpacing: 1 },
  value: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginTop: 2 },
  
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    flex: 0.48, 
    backgroundColor: '#fff',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    marginLeft: 8,
  },
});
