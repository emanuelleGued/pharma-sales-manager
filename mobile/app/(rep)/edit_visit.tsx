import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, Alert, ScrollView
} from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useVisits } from '../../src/context/VisitsContext';
import { MOCK_DOCTORS } from '../../src/mocks/doctors';

export default function EditVisitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { visits, updateVisit } = useVisits();
  const router = useRouter();

  const visit = visits.find((v) => v.id === id);
  const doctor = MOCK_DOCTORS.find((d) => d.id === visit?.doctorId);

  const [date, setDate] = useState(visit?.date || '');
  const [time, setTime] = useState(visit?.time || '');
  const [notes, setNotes] = useState(visit?.notes || '');

  if (!visit || !doctor) return null;

  const handleSave = () => {
    if (!date || !time) {
      Alert.alert('Atenção', 'Preencha a data e o horário.');
      return;
    }

    updateVisit({ ...visit, date, time, notes });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(rep)/schedule')}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Visita</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Informações Básicas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <Text style={styles.label}>NOME DO MÉDICO</Text>
          <View style={styles.inputRow}>
            <Feather name="activity" size={18} color={colors.secondary} style={styles.inputIcon} />
            <Text style={styles.inputText}>{doctor.name}</Text>
          </View>

          <View style={styles.rowFields}>
            {/* Data */}
            <View style={styles.halfField}>
              <Text style={styles.label}>DATA</Text>
              <View style={styles.inputRow}>
                <Feather name="calendar" size={18} color={colors.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {/* Horário */}
            <View style={styles.halfField}>
              <Text style={styles.label}>HORÁRIO</Text>
              <View style={styles.inputRow}>
                <Feather name="clock" size={18} color={colors.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Observações */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <View style={styles.notesContainer}>
            <Feather name="file-text" size={18} color={colors.secondary} style={{ marginTop: 2 }} />
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Adicione observações sobre a visita..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 14,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 8 },
  inputText: { fontSize: 15, color: colors.text },
  input: { flex: 1, fontSize: 15, color: colors.text },
  rowFields: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  notesContainer: {
    flexDirection: 'row', gap: 10,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14,
  },
  notesInput: { flex: 1, fontSize: 14, color: colors.text, minHeight: 80 },
  saveButton: {
    borderWidth: 2, borderColor: colors.primary,
    borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
  },
  saveText: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
});