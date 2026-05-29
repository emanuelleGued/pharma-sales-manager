import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOfflineSync } from '../context/NetworkContext';
import { useVisits } from '../context/VisitContext';

export function OfflineIndicator() {
  const insets = useSafeAreaInsets();
  const { isConnected, isSyncing } = useOfflineSync();
  const { pendingCount } = useVisits();

  if (isConnected && !isSyncing && pendingCount === 0) return null;

  const offline = !isConnected;
  const label = offline
    ? `Offline${pendingCount > 0 ? ` • ${pendingCount} pendente${pendingCount > 1 ? 's' : ''}` : ''}`
    : isSyncing
      ? 'Sincronizando...'
      : `${pendingCount} pendente${pendingCount > 1 ? 's' : ''}`;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 4 },
        offline ? styles.offline : styles.syncing,
      ]}
    >
      {isSyncing ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Feather
          name={offline ? 'cloud-off' : 'cloud'}
          size={14}
          color="#fff"
        />
      )}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  offline: {
    backgroundColor: '#6B7280',
  },
  syncing: {
    backgroundColor: '#00A896',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
