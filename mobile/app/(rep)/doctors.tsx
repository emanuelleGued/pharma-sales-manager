import React, { useState, useMemo, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { Doctor } from '../../src/types/doctor';
import DoctorService from '../../src/services/DoctorService';
import { useFocusEffect } from 'expo-router';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Visitados' | 'Pendentes' | 'Sem Visitas'>('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDoctors();
    }, [])
  );

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const doctorsFromAPI = await DoctorService.getAllDoctors();
      setDoctors(doctorsFromAPI);
    } catch (error) {
      console.error('Erro ao carregar médicos da API:', error);
      setHasError(true);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchDoctors(searchQuery);
    } else {
      loadDoctors();
    }
  }, [searchQuery]);

  const searchDoctors = async (query: string) => {
    try {
      setIsLoading(true);
      const results = await DoctorService.getAllDoctors(query);
      setDoctors(results);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      setHasError(true);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
  
      const matchesFilter =
        filter === 'Todos' ? true :
        filter === 'Visitados' ? doc.status === 'VISITADO' :
        filter === 'Pendentes' ? doc.status === 'PENDENTE' :
        doc.status === 'SEM_VISITAS';
  
      return matchesSearch && matchesFilter;
    });
  }, [doctors, searchQuery, filter]);
  
  const visitedCount = doctors.filter(d => d.status === 'VISITADO').length;
  const totalCount = doctors.length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'VISITADO':
        return { label: 'Visitado', bg: '#E6F6F4', color: '#00A896', icon: 'check-circle' };
      case 'PENDENTE':
        return { label: 'Pendente', bg: '#FEF3C7', color: '#D97706', icon: 'clock' };
      case 'SEM_VISITAS':
      default:
        return { label: 'Sem Visitas', bg: '#F1F5F9', color: '#64748B', icon: 'minus' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>Base de Médicos</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.visitedCountText}>{visitedCount}</Text> de {totalCount} visitados este mês
        </Text>
      </View>

      {hasError && (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#B91C1C" />
          <Text style={styles.errorText}>Usando dados em cache</Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

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

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {(['Todos', 'Visitados', 'Pendentes', 'Sem Visitas'] as const).map(f => (
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
        </ScrollView>
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
          >
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
              <Text style={styles.doctorClinic}>{item.clinicName} • {item.location}</Text>
            </View>
            <View style={styles.checkButton}>
              {(() => {
                const config = getStatusConfig(item.status);
                return (
                  <View style={[styles.badge, { backgroundColor: config.bg }]}>
                    <Feather name={config.icon as any} size={12} color={config.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
                  </View>
                );
              })()}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  filterWrapper: {
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingBottom: 100,
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});