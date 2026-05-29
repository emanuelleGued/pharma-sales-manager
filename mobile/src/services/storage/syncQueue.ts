import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateVisitRequest } from '../VisitService';
import { STORAGE_KEYS } from './keys';

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';

export interface QueueItem {
  localId: string;
  operation: SyncOperation;
  serverId?: number;
  payload?: CreateVisitRequest;
  createdAt: number;
  sincronizado: false;
}

export async function getQueue(): Promise<QueueItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QueueItem[];
  } catch {
    return [];
  }
}

async function writeQueue(items: QueueItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(items));
}

export async function enqueue(item: Omit<QueueItem, 'createdAt' | 'sincronizado'>): Promise<QueueItem> {
  const full: QueueItem = { ...item, createdAt: Date.now(), sincronizado: false };
  const current = await getQueue();
  await writeQueue([...current, full]);
  return full;
}

export async function removeFromQueue(localId: string): Promise<void> {
  const current = await getQueue();
  await writeQueue(current.filter((q) => q.localId !== localId));
}

export async function updateQueueItem(localId: string, patch: Partial<QueueItem>): Promise<void> {
  const current = await getQueue();
  await writeQueue(
    current.map((q) => (q.localId === localId ? { ...q, ...patch } : q))
  );
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
}

export function makeLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
