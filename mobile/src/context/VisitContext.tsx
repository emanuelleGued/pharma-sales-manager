import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Doctor, MOCK_DOCTORS } from '../mocks/docktors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Visit {
  id: string;
  doctorId: string;
  doctor?: Doctor;
  date: string;
  time: string;
  observations?: string;
  presentedMaterial?: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
}

interface VisitContextData {
  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id' | 'status'>) => void;
  updateVisit: (updated: Visit) => void;
  deleteVisit: (id: string) => void;
}

const VisitContext = createContext<VisitContextData>({} as VisitContextData);
const VISITS_STORAGE_KEY = '@pharma_visits';

export function VisitProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar as visitas salvas na inicialização
  useEffect(() => {
    async function loadVisits() {
      try {
        const storedVisits = await AsyncStorage.getItem(VISITS_STORAGE_KEY);
        if (storedVisits) {
          setVisits(JSON.parse(storedVisits));
        }
      } catch (error) {
        console.error('Erro ao carregar as visitas do AsyncStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadVisits();
  }, []);


  useEffect(() => {
    async function saveVisits() {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
        } catch (error) {
          console.error('Erro ao salvar as visitas no AsyncStorage:', error);
        }
      }
    }
    saveVisits();
  }, [visits, isLoaded]);

  const addVisit = (visitData: Omit<Visit, 'id' | 'status'>) => {
    const newVisit: Visit = {
      ...visitData,
      id: Math.random().toString(36).substring(2, 9),
      status: 'scheduled',
    };
    setVisits((prev) => [newVisit, ...prev]);
  };

  const updateVisit = (updated: Visit) => {
    setVisits((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const deleteVisit = (id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <VisitContext.Provider value={{ visits, addVisit, updateVisit, deleteVisit }}>
      {children}
    </VisitContext.Provider>
  );
}

export const useVisits = () => useContext(VisitContext);
