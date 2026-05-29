import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type SyncFn = () => Promise<void>;

interface NetworkContextData {
  isConnected: boolean;
  isSyncing: boolean;
  registerSyncHandler: (fn: SyncFn) => () => void;
  triggerSync: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextData>({} as NetworkContextData);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const handlersRef = useRef<Set<SyncFn>>(new Set());
  const wasOfflineRef = useRef<boolean>(false);

  const triggerSync = useCallback(async () => {
    if (handlersRef.current.size === 0) return;
    setIsSyncing(true);
    try {
      for (const fn of handlersRef.current) {
        try {
          await fn();
        } catch (err) {
          console.error('Erro em handler de sync:', err);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const registerSyncHandler = useCallback((fn: SyncFn) => {
    handlersRef.current.add(fn);
    return () => {
      handlersRef.current.delete(fn);
    };
  }, []);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(connected);
      wasOfflineRef.current = !connected;
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(connected);

      if (connected && wasOfflineRef.current) {
        wasOfflineRef.current = false;
        triggerSync();
      } else if (!connected) {
        wasOfflineRef.current = true;
      }
    });

    return () => unsubscribe();
  }, [triggerSync]);

  return (
    <NetworkContext.Provider
      value={{ isConnected, isSyncing, registerSyncHandler, triggerSync }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export const useOfflineSync = () => useContext(NetworkContext);
