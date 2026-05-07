import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface VisitCardProps {
  time: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  status?: 'Realizada' | 'Pendente';
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VisitCard({
  time,
  doctorName,
  specialty,
  clinic,
  status = 'Pendente',
  onPress,
  onEdit,
  onDelete,
}: VisitCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<View>(null);

  const openMenu = () => {
    menuButtonRef.current?.measure((fx, fy, width, height, px, py) => {
      setMenuPosition({ x: px - 130, y: py + height + 4 });
      setMenuVisible(true);
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.timeContainer}>
        <View style={styles.iconCircle}>
          <Feather name="clock" size={20} color={colors.secondary} />
        </View>

        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.doctorName}>{doctorName}</Text>

        <Text style={styles.specialty}>{specialty}</Text>

        <Text style={styles.clinicName}>{clinic}</Text>

        <View
          style={[
            styles.statusBadge,
            status === 'Realizada'
              ? styles.statusDone
              : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              status === 'Realizada'
                ? styles.statusDoneText
                : styles.statusPendingText,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={openMenu} ref={menuButtonRef as any}>
          <Feather name="more-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={StyleSheet.absoluteFill}>
            <View style={[styles.dropdown, { top: menuPosition.y, left: menuPosition.x }]}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => { setMenuVisible(false); onEdit?.(); }}
              >
                <Feather name="edit-2" size={16} color={colors.secondary} />
                <Text style={styles.dropdownText}>Editar Visita</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => { setMenuVisible(false); onDelete?.(); }}
              >
                <Feather name="trash-2" size={16} color={colors.primary} />
                <Text style={styles.deleteText}>Excluir Visita</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'visible',
    zIndex: 1,
  },

  timeContainer: {
    alignItems: 'center',
    marginRight: 16,
  },

  iconCircle: {
    backgroundColor: colors.successBackground,
    padding: 10,
    borderRadius: 50,
    marginBottom: 8,
  },

  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },

  infoContainer: {
    flex: 1,
  },

  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },

  specialty: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  clinicName: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  menuContainer: {
    position: 'relative',
    zIndex: 999,
    elevation: 999,
  },

  dropdown: {
    position: 'absolute',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 8,
    width: 170,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  dropdownText: {
    color: colors.text,
    fontWeight: '600',
  },

  deleteText: {
    color: colors.primary,
    fontWeight: '600',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusDone: {
    backgroundColor: colors.successBackground,
  },

  statusPending: {
    backgroundColor: '#F2F4F7',
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  statusDoneText: {
    color: colors.secondary,
  },

  statusPendingText: {
    color: colors.textSecondary,
  },
});