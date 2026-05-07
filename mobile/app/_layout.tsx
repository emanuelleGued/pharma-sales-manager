import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { VisitProvider } from '../src/context/VisitContext';

export default function RootLayout() {
  return (
    <VisitProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F7FA' },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="dark" />
    </VisitProvider>
  );
}