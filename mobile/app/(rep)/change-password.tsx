import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = () => {
  if (formData.newPassword !== formData.confirmPassword) {
    Alert.alert("Erro", "As senhas não coincidem.");
    return;
  }
  router.replace({
    pathname: '/(rep)/profile',
    params: { success: 'password_updated' }
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(rep)/profile')}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Alterar Senha</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Escolha uma senha forte de pelo menos 8 caracteres para sua segurança.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Senha Atual */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Atual</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword.current}
                value={formData.currentPassword}
                onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                placeholder="••••••••"
              />
              <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
                <Feather name={showPassword.current ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nova Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova Senha</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword.new}
                value={formData.newPassword}
                onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                placeholder="••••••••"
              />
              <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                <Feather name={showPassword.new ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Nova Senha</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword.confirm}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="••••••••"
              />
              <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                <Feather name={showPassword.confirm ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Atualizar Senha</Text>
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
  content: { padding: 24 },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoText: { 
    color: '#1E40AF', 
    fontSize: 14 
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
  inputIcon: { marginRight: 12 },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: colors.text 
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
