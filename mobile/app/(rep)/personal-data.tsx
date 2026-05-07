import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function PersonalDataScreen() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "Maria Santos",
    email: "rep@biofarma.com",
    phone: "(11) 91234-5678",
    position: "Representante Comercial",
  });

  const handleSave = () => {
    Alert.alert("Sucesso", "Seus dados foram atualizados!", [
      { text: "OK", onPress: () => router.navigate('/(rep)/profile') } 
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(rep)/profile')}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Dados Pessoais</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.name.split(' ').map(n => n[0]).join('')}
            </Text>
            <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
              <Feather name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Seu nome"
              />
            </View>
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Feather name="mail" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textSecondary }]}
                value={formData.email}
                editable={false} 
              />
            </View>
            <Text style={styles.helperText}>O e-mail não pode ser alterado</Text>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone/WhatsApp</Text>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Position */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cargo</Text>
            <View style={styles.inputContainer}>
              <Feather name="briefcase" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.position}
                onChangeText={(text) => setFormData({ ...formData, position: text })}
                placeholder="Seu cargo"
              />
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  content: { 
    padding: 24 
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    borderWidth: 4,
    borderColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#C8102E',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00A896',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  form: { 
    gap: 20, 
    marginBottom: 32 
  },
  inputGroup: { 
    gap: 8 
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  inputIcon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: colors.text 
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { 
    color: colors.background, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
