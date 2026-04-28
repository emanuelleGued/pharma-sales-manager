import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importante!
import { colors } from '../src/theme/colors';

interface HeaderProps {
  onProfileClick: () => void;
  onNotificationsClick: () => void;
}

export function Header({ onProfileClick, onNotificationsClick }: HeaderProps) {
  // Isso pega o tamanho da barra de status do seu celular
  const insets = useSafeAreaInsets(); 

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.iconBox}>
          <FontAwesome name="heart" size={16} color={colors.background} />
        </View>
        <Text style={styles.brandText}>
          Bio<Text style={styles.brandHighlight}>Farma</Text>
        </Text>
      </View>

      {/* Ícones da Direita */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onNotificationsClick}>
          <Feather name="bell" size={20} color={colors.textSecondary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onProfileClick}>
          <Feather name="user" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});