import AsyncStorage from '@react-native-async-storage/async-storage';
import { Visit } from '../../context/VisitContext';
import { STORAGE_KEYS } from './keys';

export interface CachedVisit extends Visit {
  sincronizado: boolean;
  localId?: string;
}

export async function getCachedVisits(): Promise<CachedVisit[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.VISITS_CACHE);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CachedVisit[];
  } catch {
    return [];
  }
}

export async function setCachedVisits(visits: CachedVisit[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.VISITS_CACHE, JSON.stringify(visits));
}

export async function upsertCachedVisit(visit: CachedVisit): Promise<void> {
  const current = await getCachedVisits();
  const matchIdx = current.findIndex((v) => {
    if (visit.localId && v.localId === visit.localId) return true;
    return v.id === visit.id;
  });
  if (matchIdx >= 0) {
    current[matchIdx] = visit;
  } else {
    current.unshift(visit);
  }
  await setCachedVisits(current);
}

export async function removeCachedVisit(idOrLocalId: number | string): Promise<void> {
  const current = await getCachedVisits();
  await setCachedVisits(
    current.filter((v) => v.id !== idOrLocalId && v.localId !== idOrLocalId)
  );
}

export async function replaceLocalIdWithServerId(
  localId: string,
  serverVisit: CachedVisit
): Promise<void> {
  const current = await getCachedVisits();
  await setCachedVisits(
    current.map((v) => (v.localId === localId ? serverVisit : v))
  );
}
