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
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { MOCK_DOCTORS, Doctor } from '../../src/mocks/doctors';
import { useVisits } from '../../src/context/VisitContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewVisitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const isEditMode = params.editMode === 'true';
  const { addVisit } = useVisits();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [observations, setObservations] = useState('');
  const [presentedMaterial, setPresentedMaterial] = useState('');
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); 
    if (selectedDate) {
      setDate(selectedDate);
      setVisitDate(formatDate(selectedDate));
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false); 
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setVisitTime(`${hours}:${minutes}`);
    }
  };


  const isFormValid = selectedDoctor && visitDate && visitTime;

  const handleSubmit = () => {
    if (selectedDoctor && visitDate && visitTime) {
      addVisit({
        doctor: selectedDoctor,
        date: visitDate,
        time: visitTime,
        observations: observations,
        presentedMaterial: presentedMaterial,
      });

      setSelectedDoctor(null);
      setVisitDate('');
      setVisitTime('');
      setObservations('');
      setPresentedMaterial('');

      router.replace({
        pathname: '/(rep)',
        params: { success: Date.now().toString() } 
      });
    } else {
      Alert.alert("Erro", "Por favor, preencha Médico, Data e Hora.");
    }
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity 
      style={styles.doctorCard} 
      onPress={() => {
        setSelectedDoctor(item);
        setIsDoctorModalOpen(false);
      }}
    >
      <View style={styles.doctorIconCircle}>
        <Feather name="user" size={20} color="#00A896" />
      </View>
      <View style={styles.doctorDetails}>
        <Text style={styles.doctorNameText}>{item.name}</Text>
        <Text style={styles.doctorSpecialtyText}>{item.specialty}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Editar Visita' : 'Registrar Visita'}
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          
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
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log("Abrindo Data..."); 
                    setShowDatePicker(true);
                  }}
                  style={styles.inputContainer}
                >
                  <Feather name="calendar" size={20} color="#00A896" style={styles.inputIcon} />
                  <Text style={visitDate ? styles.inputText : styles.placeholderText}>
                    {visitDate || 'Selecionar...'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Horário da Visita */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>HORÁRIO</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log("Abrindo Hora..."); 
                    setShowTimePicker(true);
                  }}
                  style={styles.inputContainer}
                >
                  <Feather name="clock" size={20} color="#00A896" style={styles.inputIcon} />
                  <Text style={visitTime ? styles.inputText : styles.placeholderText}>
                    {visitTime || 'Selecionar...'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Card: Material Apresentado */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Material Apresentado</Text>
            <View style={[
              styles.textAreaContainer,
              focusedField === 'material' && styles.inputContainerFocused
            ]}>
              <Feather name="package" size={20} color="#00A896" style={styles.textAreaIcon} />
              <TextInput
                style={styles.textArea}
                value={presentedMaterial}
                onChangeText={setPresentedMaterial}
                onFocus={() => setFocusedField('material')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ex: Folder de produtos, amostras..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
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

          {/* Botão Salvar */}
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

        {/* Modal de Seleção de Médico */}
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
      </KeyboardAvoidingView>
      

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
    borderWidth: 2,
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
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8F9FA', 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1C1E',
  },
  modalList: {
    paddingBottom: 24,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  doctorIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6F6F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  doctorSpecialtyText: {
    fontSize: 14,
    color: '#00A896',
    fontWeight: '600',
    marginTop: 2,
  },
});
