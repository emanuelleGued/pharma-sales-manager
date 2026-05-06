import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { MOCK_DOCTORS, Doctor } from '../../src/mocks/doctors';
import { useVisits } from '../../src/context/VisitContext';

export default function NewVisitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const isEditMode = params.editMode === 'true';
  const { addVisit } = useVisits();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [observations, setObservations] = useState('');
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, ''); 
      let formatted = cleaned;
      if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
      setVisitDate(formatted);
  };

  const handleTimeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    setVisitTime(formatted); 
  };

  const isFormValid = selectedDoctor && visitDate && visitTime;

  const handleSubmit = () => {
    if (isFormValid) {
      if (!isEditMode && selectedDoctor) {
        addVisit({
          doctor: selectedDoctor,
          date: visitDate,
          time: visitTime,
          observations: observations
        });
      }

      Alert.alert(
        "Sucesso!", 
        isEditMode ? "Visita atualizada." : "Visita registrada com sucesso.",
        [{ text: "OK", onPress: () => router.navigate('/(rep)') }]
      );
    }
  };

  // Renderiza cada médico na lista do Modal
  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity 
      style={styles.doctorListItem}
      onPress={() => {
        setSelectedDoctor(item);
        setIsDoctorModalOpen(false);
      }}
    >
      <View style={styles.doctorAvatar}>
        <Text style={styles.doctorAvatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty} • {item.clinicName}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Editar Visita' : 'Registrar Visita'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card: Informações Básicas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          {/* Seleção de Médico */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME DO MÉDICO</Text>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setIsDoctorModalOpen(true)}
              style={[
                styles.inputContainer,
                isDoctorModalOpen && styles.inputContainerFocused
              ]}
            >
              <Feather name="user" size={20} color="#00A896" style={styles.inputIcon} />
              <Text style={selectedDoctor ? styles.inputText : styles.placeholderText}>
                {selectedDoctor ? selectedDoctor.name : 'Selecionar médico...'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {/* Data da Visita */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>DATA</Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'date' && styles.inputContainerFocused
              ]}>
                <Feather name="calendar" size={20} color="#00A896" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={visitDate}
                  onChangeText={handleDateChange}
                  onFocus={() => setFocusedField('date')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Horário da Visita */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>HORÁRIO</Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'time' && styles.inputContainerFocused
              ]}>
                <Feather name="clock" size={20} color="#00A896" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={visitTime}
                  onChangeText={handleTimeChange}
                  onFocus={() => setFocusedField('time')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Card: Observações */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <View style={[
            styles.textAreaContainer,
            focusedField === 'notes' && styles.inputContainerFocused
          ]}>
            <Feather name="file-text" size={20} color="#00A896" style={styles.textAreaIcon} />
            <TextInput
              style={styles.textArea}
              value={observations}
              onChangeText={setObservations}
              onFocus={() => setFocusedField('notes')}
              onBlur={() => setFocusedField(null)}
              placeholder="Adicione notas sobre a visita..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botão Salvar (Estilo Outline conforme web) */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isFormValid ? styles.submitButtonActive : styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!isFormValid}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.submitButtonText,
            isFormValid ? styles.submitButtonTextActive : styles.submitButtonTextDisabled
          ]}>
            {isEditMode ? 'Salvar Alterações' : 'Confirmar Cadastro'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Seleção de Médico (Bottom Sheet Style) */}
      <Modal
        visible={isDoctorModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDoctorModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Médico</Text>
              <TouchableOpacity onPress={() => setIsDoctorModalOpen(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={MOCK_DOCTORS}
              keyExtractor={(item) => item.id}
              renderItem={renderDoctorItem}
              contentContainerStyle={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#C8102E',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  content: { 
    padding: 24,
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: '#C8102E',
    shadowColor: '#C8102E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  placeholderText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
  },
  textAreaContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 120,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  submitButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonActive: {
    backgroundColor: 'transparent',
    borderColor: '#C8102E',
  },
  submitButtonDisabled: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  submitButtonTextActive: {
    color: '#C8102E',
  },
  submitButtonTextDisabled: {
    color: '#9CA3AF',
  },
  
  // Estilos do Modal (Bottom Sheet)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalList: {
    paddingBottom: 24,
  },
  doctorListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C8102E',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
