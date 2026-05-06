import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const userName = "Carlos Silva";
  const userRole = "Gerente Regional";
  const userEmail = "carlos.silva@biofarma.com.br";

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja sair do aplicativo?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: () => router.replace('/') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>{userRole}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>

          {/* Personal Data */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push('./personal-data')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 168, 150, 0.1)' }]}>
                <Feather name="user" size={20} color="#00A896" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Dados Pessoais</Text>
                <Text style={styles.menuItemSubtitle}>Nome, e-mail e telefone</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push('./change-password')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(200, 16, 46, 0.1)' }]}>
                <Feather name="lock" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Alterar Senha</Text>
                <Text style={styles.menuItemSubtitle}>Segurança da conta</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Notification Settings */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push('./notification-settings')} 
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F5F7FA' }]}>
                <Feather name="bell" size={20} color={colors.text} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Configurações de Notificação</Text>
                <Text style={styles.menuItemSubtitle}>Preferências de alertas</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Feather name="log-out" size={20} color={colors.primary} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  content: { padding: 24, paddingBottom: 100 },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  profileInfo: { flex: 1, justifyContent: 'center' },
  userName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  userRole: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  userEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  menuItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  menuItemSubtitle: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 2 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    gap: 8,
  },
  logoutText: { 
    color: colors.primary, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});
