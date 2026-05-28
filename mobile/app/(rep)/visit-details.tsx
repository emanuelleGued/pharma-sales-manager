import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useVisits } from '../../src/context/VisitContext';
import DoctorService, { DoctorResponse } from '../../src/services/DoctorService';

export default function VisitDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  const visitId = Number(params.id);
  
  const { visits, updateVisit } = useVisits();
  const visit = visits.find(v => v.id === visitId);
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);

  useEffect(() => {
    if (visit?.doctorId) {
      DoctorService.getAllDoctors()
        .then((docs) => {
          const found = docs.find((d) => Number(d.id) === visit.doctorId);
          if (found) setDoctor(found);
        })
        .catch((err) => console.error('Erro ao carregar dados do médico para conclusão:', err));
    }
  }, [visit?.doctorId]);

  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [goalAchieved, setGoalAchieved] = useState(false);

  const results = [
    { id: 'CONCLUIDA', label: 'Visita Concluída', icon: 'check-circle' as const },
    { id: 'REAGENDADA', label: 'Reagendada', icon: 'clock' as const },
    { id: 'CANCELADA', label: 'Não Realizada/Cancelada', icon: 'x-circle' as const },
  ];

  const handleSubmit = () => {
    let message = 'Visita atualizada com sucesso!';
    if (selectedResult === 'CONCLUIDA') message = 'Visita concluída com sucesso!';
    else if (selectedResult === 'REAGENDADA') message = 'Visita reagendada!';
    else if (selectedResult === 'CANCELADA') message = 'Visita cancelada!';

    if (visit && selectedResult) {
      updateVisit(visit.id, {
        ...visit,
        status: selectedResult as 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA',
        observation: notes, 
      });
    }

    router.replace({
      pathname: '/(rep)',
      params: { success: Date.now().toString(), toastMessage: message }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Visita</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Card */}
        <View style={styles.doctorCard}>
          <View style={styles.iconContainer}>
            <Feather name="map-pin" size={24} color={colors.secondary} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.doctorName}>{doctor?.name || 'Médico não encontrado'}</Text>
            <Text style={styles.doctorSpecialty}>{doctor?.specialty || ''}</Text>
            
            <View style={styles.spacer} />

            <Text style={styles.infoText}>{doctor?.clinicName || ''}</Text>
            <Text style={styles.infoText}>{doctor?.location || ''}</Text>
            
            <View style={styles.spacer} />
            
            <View style={styles.timeRow}>
              <Feather name="clock" size={14} color={colors.secondary} />
              <Text style={styles.timeText}>Agendado para {visit?.time || '--:--'}</Text>
            </View>
          </View>
        </View>

        {/* Resultado da Visita */}
        <Text style={styles.sectionTitle}>Resultado da Visita</Text>
        <View style={styles.resultsContainer}>
          {results.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.resultCard, 
                selectedResult === item.id && styles.resultCardSelected
              ]}
              onPress={() => setSelectedResult(item.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.resultIconWrapper, 
                selectedResult === item.id && styles.resultIconWrapperSelected
              ]}>
                 <Feather 
                   name={item.icon} 
                   size={20} 
                   color={selectedResult === item.id ? colors.secondary : colors.textSecondary} 
                 />
              </View>
              <Text style={[
                styles.resultText, 
                selectedResult === item.id && styles.resultTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedResult === 'CONCLUIDA' && (
          <View style={styles.goalCard}>
            <View style={styles.goalTextContainer}>
              <Text style={styles.goalTitle}>Meta atingida nesta visita?</Text>
              <Text style={styles.goalSubtext}>Marque se houve sucesso comercial</Text>
            </View>
            <Switch
              value={goalAchieved}
              onValueChange={setGoalAchieved}
              trackColor={{ false: '#E2E8F0', true: colors.secondary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        )}

        {/* Notas Rápidas */}
        <Text style={styles.sectionTitle}>Notas Rápidas</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Adicione observações sobre a visita..."
          placeholderTextColor={colors.textSecondary}
          multiline={true}
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />

        {/* Bottom Button */}
        <TouchableOpacity style={styles.submitButton} activeOpacity={0.7} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Confirmar e Atualizar Meta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
    backgroundColor: colors.surface,
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, 
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2, 
  },
  iconContainer: {
    backgroundColor: colors.successBackground,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  spacer: {
    height: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  resultsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  resultCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: '#F2FBF9',
  },
  resultIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultIconWrapperSelected: {
    backgroundColor: colors.successBackground,
  },
  resultText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  resultTextSelected: {
    color: colors.text,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginBottom: 24,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  goalSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 120,
    marginBottom: 32,
  },
  submitButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
