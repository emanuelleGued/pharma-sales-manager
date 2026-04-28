import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface RepFabMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewVisit: () => void;
  onScheduleReturn: () => void;
}

export function RepFabMenu({ isOpen, onClose, onNewVisit, onScheduleReturn }: RepFabMenuProps) {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop Escuro - Clicar fora fecha o modal */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        
        {/* Container Principal que sobe */}
        <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Ações Rápidas</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Botão: Nova Visita */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderColor: colors.primary }]} 
            onPress={onNewVisit}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(200, 50, 50, 0.1)' }]}>
              <Feather name="map-pin" size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.menuItemTitle}>Nova Visita</Text>
              <Text style={styles.menuItemSub}>Registrar uma nova visita realizada</Text>
            </View>
          </TouchableOpacity>

          {/* Botão: Agendar Retorno */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={onScheduleReturn}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 158, 142, 0.1)' }]}>
              <Feather name="calendar" size={24} color={colors.secondary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.menuItemTitle}>Agendar Retorno</Text>
              <Text style={styles.menuItemSub}>Marcar próxima visita com um profissional</Text>
            </View>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  menuItemSub: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});