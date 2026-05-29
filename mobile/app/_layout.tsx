import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { VisitProvider } from '../src/context/VisitContext';
import { NetworkProvider } from '../src/context/NetworkContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { OfflineIndicator } from '../src/components/OfflineIndicator';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <VisitProvider>
          <NotificationProvider>
            <OfflineIndicator />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F5F7FA' },
              }}
            >
              <Stack.Screen name="index" />
            </Stack>
            <StatusBar style="dark" hidden={true} />
          </NotificationProvider>
        </VisitProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
