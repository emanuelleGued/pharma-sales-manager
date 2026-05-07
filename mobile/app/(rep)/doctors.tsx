import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { MOCK_DOCTORS, Doctor } from '../../mocks/docktors';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Visitados' | 'Pendentes'>('Todos');

  const handleToggleVisited = (id: string) => {
    setDoctors(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, visited: !doc.visited } : doc
      )
    );
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filter === 'Todos' ? true :
        filter === 'Visitados' ? doc.visited :
          !doc.visited; // Pendentes

      return matchesSearch && matchesFilter;
    });
  }, [doctors, searchQuery, filter]);

  const visitedCount = doctors.filter(d => d.visited).length;
  const totalCount = doctors.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Base de Médicos</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.visitedCountText}>{visitedCount}</Text> de {totalCount} visitados este mês
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar médico ou especialidade"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {(['Todos', 'Visitados', 'Pendentes'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f ? styles.filterButtonActive : styles.filterButtonInactive
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText,
              filter === f ? styles.filterTextActive : styles.filterTextInactive
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.doctorCard}
            activeOpacity={0.7}
            onPress={() => handleToggleVisited(item.id)}
          >
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
              <Text style={styles.doctorClinic}>{item.clinicName} • {item.location}</Text>
            </View>
            <View style={styles.checkButton}>
              {item.visited ? (
                <View style={styles.circleVisited} />
              ) : (
                <View style={styles.circlePending} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },
  visitedCountText: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    borderColor: colors.secondary,
    backgroundColor: '#E8F5F3',
  },
  filterButtonInactive: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.secondary,
  },
  filterTextInactive: {
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // padding to account for bottom navigation bar
    gap: 12,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    // Add subtle shadow as seen in the mockup
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  doctorClinic: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  checkButton: {
    padding: 4,
  },
  circleVisited: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 6,
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  circlePending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: colors.background,
  },
});