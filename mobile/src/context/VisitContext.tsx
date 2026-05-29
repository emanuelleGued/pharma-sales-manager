import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';

import { Doctor } from '../types/doctor';

import VisitService, {
  CreateVisitRequest,
  VisitResponse,
} from '../services/VisitService';

import {
  CachedVisit,
  getCachedVisits,
  removeCachedVisit,
  replaceLocalIdWithServerId,
  setCachedVisits,
  upsertCachedVisit,
} from '../services/storage/visitStorage';

import {
  enqueue,
  getQueue,
  makeLocalId,
  removeFromQueue,
  QueueItem,
} from '../services/storage/syncQueue';

import { useOfflineSync } from './NetworkContext';

export interface Visit {
  id: number | string;
  doctorId: number;
  doctor?: Doctor;
  doctorName?: string;
  userId: number;
  date: string;
  time: string;
  observations?: string;
  presentedMaterial?: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA';
  sincronizado?: boolean;
  localId?: string;
}

interface VisitContextData {
  visits: Visit[];
  loading: boolean;
  pendingCount: number;

  loadVisits: () => Promise<void>;
  addVisit: (visit: CreateVisitRequest) => Promise<void>;
  updateVisit: (id: number | string, visit: CreateVisitRequest) => Promise<void>;
  deleteVisit: (id: number | string) => Promise<void>;
}

const VisitContext = createContext<VisitContextData>({} as VisitContextData);

function mapVisitResponseToVisit(visit: VisitResponse): CachedVisit {
  return {
    id: visit.id,
    doctorId: visit.doctorId,
    doctorName: visit.doctorName,
    userId: visit.userId,
    date: visit.date,
    time: visit.time,
    observations: visit.observation,
    presentedMaterial: visit.presentedMaterial,
    status: visit.status,
    sincronizado: true,
  };
}

export function VisitProvider({ children }: { children: ReactNode }) {
  const { isConnected, registerSyncHandler } = useOfflineSync();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    const q = await getQueue();
    setPendingCount(q.length);
  }, []);

  const loadVisits = useCallback(async () => {
    setLoading(true);
    try {
      const cached = await getCachedVisits();
      if (cached.length > 0) setVisits(cached);

      if (!isConnected) {
        await refreshPendingCount();
        return;
      }

      const response = await VisitService.getAllVisits();
      const formatted = response.map(mapVisitResponseToVisit);

      const queue = await getQueue();
      const pendingLocalIds = new Set(queue.map((q) => q.localId));
      const pendingFromCache = (await getCachedVisits()).filter(
        (v) => v.localId && pendingLocalIds.has(v.localId)
      );

      const merged: CachedVisit[] = [...pendingFromCache, ...formatted];
      await setCachedVisits(merged);
      setVisits(merged);
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
      const cached = await getCachedVisits();
      setVisits(cached);
    } finally {
      await refreshPendingCount();
      setLoading(false);
    }
  }, [isConnected, refreshPendingCount]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const addVisit = useCallback(
    async (visitData: CreateVisitRequest) => {
      if (isConnected) {
        try {
          const created = await VisitService.createVisit(visitData);
          const formatted = mapVisitResponseToVisit(created);
          await upsertCachedVisit(formatted);
          setVisits((prev) => [formatted, ...prev]);
          return;
        } catch (err) {
          console.warn('Falha na API ao criar visita, enfileirando offline:', err);
        }
      }

      const localId = makeLocalId();
      const optimistic: CachedVisit = {
        id: localId,
        doctorId: visitData.doctorId,
        userId: visitData.userId,
        date: visitData.date,
        time: visitData.time,
        observations: visitData.observation,
        presentedMaterial: visitData.presentedMaterial,
        status: visitData.status,
        sincronizado: false,
        localId,
      };
      await upsertCachedVisit(optimistic);
      await enqueue({ localId, operation: 'CREATE', payload: visitData });
      setVisits((prev) => [optimistic, ...prev]);
      await refreshPendingCount();
    },
    [isConnected, refreshPendingCount]
  );

  const updateVisit = useCallback(
    async (id: number | string, visitData: CreateVisitRequest) => {
      const isLocal = typeof id === 'string';

      if (isConnected && !isLocal) {
        try {
          const updated = await VisitService.updateVisit(id as number, visitData);
          const formatted = mapVisitResponseToVisit(updated);
          await upsertCachedVisit(formatted);
          setVisits((prev) => prev.map((v) => (v.id === id ? formatted : v)));
          return;
        } catch (err) {
          console.warn('Falha ao atualizar visita, enfileirando offline:', err);
        }
      }

      const localId = isLocal ? (id as string) : makeLocalId();
      const patched: CachedVisit = {
        id,
        doctorId: visitData.doctorId,
        userId: visitData.userId,
        date: visitData.date,
        time: visitData.time,
        observations: visitData.observation,
        presentedMaterial: visitData.presentedMaterial,
        status: visitData.status,
        sincronizado: false,
        localId,
      };
      await upsertCachedVisit(patched);
      await enqueue({
        localId,
        operation: 'UPDATE',
        serverId: isLocal ? undefined : (id as number),
        payload: visitData,
      });
      setVisits((prev) => prev.map((v) => (v.id === id ? patched : v)));
      await refreshPendingCount();
    },
    [isConnected, refreshPendingCount]
  );

  const deleteVisit = useCallback(
    async (id: number | string) => {
      const isLocal = typeof id === 'string';

      if (isConnected && !isLocal) {
        try {
          await VisitService.deleteVisit(id as number);
          await removeCachedVisit(id);
          setVisits((prev) => prev.filter((v) => v.id !== id));
          return;
        } catch (err) {
          console.warn('Falha ao deletar visita, enfileirando offline:', err);
        }
      }

      if (isLocal) {
        await removeCachedVisit(id);
        await removeFromQueue(id as string);
        setVisits((prev) => prev.filter((v) => v.id !== id));
      } else {
        await removeCachedVisit(id);
        await enqueue({
          localId: makeLocalId(),
          operation: 'DELETE',
          serverId: id as number,
        });
        setVisits((prev) => prev.filter((v) => v.id !== id));
      }
      await refreshPendingCount();
    },
    [isConnected, refreshPendingCount]
  );

  const drainQueue = useCallback(async () => {
    const queue = await getQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      try {
        await processQueueItem(item);
        await removeFromQueue(item.localId);
      } catch (err) {
        console.error(`Falha ao sincronizar item ${item.localId}:`, err);
      }
    }

    await loadVisits();
  }, [loadVisits]);

  useEffect(() => {
    const unsubscribe = registerSyncHandler(drainQueue);
    return unsubscribe;
  }, [registerSyncHandler, drainQueue]);

  return (
    <VisitContext.Provider
      value={{
        visits,
        loading,
        pendingCount,
        loadVisits,
        addVisit,
        updateVisit,
        deleteVisit,
      }}
    >
      {children}
    </VisitContext.Provider>
  );
}

async function processQueueItem(item: QueueItem): Promise<void> {
  switch (item.operation) {
    case 'CREATE': {
      if (!item.payload) return;
      const created = await VisitService.createVisit(item.payload);
      const formatted = mapVisitResponseToVisit(created);
      await replaceLocalIdWithServerId(item.localId, formatted);
      return;
    }
    case 'UPDATE': {
      if (!item.payload || !item.serverId) return;
      const updated = await VisitService.updateVisit(item.serverId, item.payload);
      const formatted = mapVisitResponseToVisit(updated);
      await upsertCachedVisit(formatted);
      return;
    }
    case 'DELETE': {
      if (!item.serverId) return;
      await VisitService.deleteVisit(item.serverId);
      return;
    }
  }
}

export const useVisits = () => useContext(VisitContext);
