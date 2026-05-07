import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function VisitDetailsScreen() {
  const router = useRouter();
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const results = [
    { id: 'completed', label: 'Visita Concluída', icon: 'check-circle' as const },
    { id: 'rescheduled', label: 'Reagendada', icon: 'clock' as const },
    { id: 'canceled', label: 'Não Realizada/Cancelada', icon: 'x-circle' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
            <Text style={styles.doctorName}>Dr. Marcos</Text>
            <Text style={styles.doctorSpecialty}>Cardiologista</Text>
            
            <View style={styles.spacer} />

            <Text style={styles.infoText}>Clínica Coração Saudável</Text>
            <Text style={styles.infoText}>Av. Paulista, 1000 - São Paulo, SP</Text>
            
            <View style={styles.spacer} />
            
            <View style={styles.timeRow}>
              <Feather name="clock" size={14} color={colors.secondary} />
              <Text style={styles.timeText}>Agendado para 10:00</Text>
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
        <TouchableOpacity style={styles.submitButton} activeOpacity={0.7} onPress={() => router.back()}>
          <Text style={styles.submitButtonText}>Confirmar e Atualizar Meta</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 40,
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
