import { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { RepFabMenu } from '../../src/components/RepFabMenu';

export default function RepLayout() {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: Platform.OS === 'ios' ? 88 : 70 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            paddingTop: 10,
            position: 'absolute',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ 
            title: 'Início', 
            tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> 
          }}
        />
        
        <Tabs.Screen
          name="calendar"
          options={{ 
            title: 'Agenda', 
            tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} /> 
          }}
        />
        
        {/* Botão Central */}
        <Tabs.Screen
          name="add"
          options={{
            title: '', 
            tabBarIcon: () => (
              <View style={styles.fabButton}>
                <Feather name="plus" size={32} color={colors.background} />
              </View>
            ),
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              setIsFabOpen(true);
            },
          })}
        />

        <Tabs.Screen
          name="doctors"
          options={{ 
            title: 'Médicos', 
            tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} /> 
          }}
        />
        
        <Tabs.Screen
          name="performance"
          options={{ 
            title: 'Métricas', 
            tabBarIcon: ({ color }) => <Feather name="trending-up" size={24} color={color} /> 
          }}
        />

        {/* Telas Ocultas */}
        <Tabs.Screen name="new-visit" options={{ href: null }} />
        <Tabs.Screen name="schedule-return" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
      </Tabs>

      <RepFabMenu 
        isOpen={isFabOpen}
        onClose={() => setIsFabOpen(false)}
        onNewVisit={() => {
          setIsFabOpen(false);
          router.push('/(rep)/new-visit');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});