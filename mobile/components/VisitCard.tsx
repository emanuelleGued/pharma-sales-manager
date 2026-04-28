import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';

interface VisitCardProps {
  time: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  onPress?: () => void;
}

export function VisitCard({ time, doctorName, specialty, clinic, onPress }: VisitCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.timeContainer}>
        <View style={styles.iconCircle}>
          <Feather name="clock" size={20} color={colors.secondary} />
        </View>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.doctorName}>{doctorName} - {specialty}</Text>
        <Text style={styles.clinicName}>{clinic}</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      </View>
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
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2, // Sombra leve para Android
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
  clinicName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  arrowContainer: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 50,
  },
});