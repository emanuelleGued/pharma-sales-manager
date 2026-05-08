import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useVisits } from '../../src/context/VisitContext';
import { MOCK_DOCTORS } from '../../src/mocks/docktors';

export default function ScheduleDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { visits = [], deleteVisit } = useVisits();

  const visit = visits.find((v) => v.id === id);
  const doctor = MOCK_DOCTORS.find((d) => d.id === visit?.doctorId);

  if (!visit || !doctor) return null;

  const dateObj = new Date(visit.date + 'T12:00:00');
  const displayDate = dateObj.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const handleDelete = () => {
    Alert.alert('Excluir visita', 'Tem certeza que deseja remover este registro?', [
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

  const statusConfig = {
    scheduled: { label: 'Pendente', color: '#0369A1', bg: '#E0F2FE' },
    completed: { label: 'Concluída', color: '#00A896', bg: '#F0F9F7' },
    rescheduled: { label: 'Reagendada', color: '#D97706', bg: '#FEF3C7' },
    canceled: { label: 'Cancelada', color: '#B91C1C', bg: '#FEE2E2' },
  };

  const currentStatus = statusConfig[visit.status as keyof typeof statusConfig] || statusConfig.scheduled;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Visita</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* CARD DO MÉDICO */}
        <View style={styles.card}>
          <View style={styles.doctorHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.specialty}>{doctor.specialty}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: currentStatus.bg }]}>
              <Feather name="check-circle" size={12} color={currentStatus.color} style={{ marginRight: 4 }} />
              <Text style={[styles.statusText, { color: currentStatus.color }]}>{currentStatus.label}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.clinicContainer}>
            <Feather name="map-pin" size={18} color="#00A896" style={styles.clinicIcon} />
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{doctor.clinicName}</Text>
              <Text style={styles.location}>{doctor.location}</Text>
            </View>
          </View>
        </View>

        {/* DATA E HORÁRIO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data & Horário</Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <View style={styles.iconCircle}>
                <Feather name="calendar" size={18} color="#00A896" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.label}>DATA</Text>
                <Text style={styles.value}>{displayDate}</Text>
              </View>
            </View>

            <View style={styles.dateTimeItem}>
              <View style={styles.iconCircle}>
                <Feather name="clock" size={18} color="#00A896" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.label}>HORÁRIO</Text>
                <Text style={styles.value}>{visit.time}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* MATERIAL APRESENTADO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="package" size={20} color="#00A896" />
            <Text style={styles.sectionTitleWithIcon}>Material Apresentado</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              {visit.presentedMaterial || 'Nenhum material registrado.'}
            </Text>
          </View>
        </View>

        {/* OBSERVAÇÕES */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="file-text" size={20} color="#00A896" />
            <Text style={styles.sectionTitleWithIcon}>Observações</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              {visit.observations || 'Nenhuma observação registrada.'}
            </Text>
          </View>
        </View>

        {/* AÇÕES */}
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: Platform.OS === 'android' ? 40 : 16, 
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 100 
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  doctorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  doctorName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  specialty: { fontSize: 15, color: '#00A896', fontWeight: '600', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 13, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  clinicContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  clinicIcon: { marginRight: 10, marginTop: 2 },
  clinicInfo: { flex: 1 },
  clinicName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  location: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  dateTimeItem: { flexDirection: 'row', alignItems: 'center', flex: 0.48 },
  iconCircle: { backgroundColor: '#F0F9F7', padding: 10, borderRadius: 12 },
  label: { fontSize: 11, color: colors.textSecondary, fontWeight: 'bold', letterSpacing: 0.5 },
  value: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitleWithIcon: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginLeft: 10 },
  contentBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  contentText: { fontSize: 15, color: '#374151', lineHeight: 22 },

  actionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10,
    paddingBottom: 20 
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
    backgroundColor: '#FFF',
  },
  outlineButtonText: { fontSize: 16, fontWeight: 'bold', color: colors.secondary, marginLeft: 8 },
  dateTimeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center' 
  },
});
