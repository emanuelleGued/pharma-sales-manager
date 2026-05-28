import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

import { Doctor } from '../types/doctor';

import VisitService, {
  CreateVisitRequest,
  VisitResponse,
} from '../services/VisitService';

export interface Visit {
  id: number;
  doctorId: number;
  doctor?: Doctor;
  doctorName?: string;
  userId: number;
  date: string;
  time: string; 
  observations?: string;
  presentedMaterial?: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA'; 
}

interface VisitContextData {
  visits: Visit[];
  loading: boolean;

  loadVisits: () => Promise<void>;

  addVisit: (
    visit: CreateVisitRequest
  ) => Promise<void>;

  updateVisit: (
    id: number,
    visit: CreateVisitRequest
  ) => Promise<void>;

  deleteVisit: (
    id: number
  ) => Promise<void>;
}

const VisitContext =
  createContext<VisitContextData>(
    {} as VisitContextData
  );

  function mapVisitResponseToVisit(visit: VisitResponse): Visit {
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
    };
  }

export function VisitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [visits, setVisits] = useState<
    Visit[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  async function loadVisits() {
    try {
      setLoading(true);

      const response =
        await VisitService.getAllVisits();

      const formattedVisits =
        response.map(
          mapVisitResponseToVisit
        );

      setVisits(formattedVisits);
    } catch (error) {
      console.error(
        'Erro ao carregar visitas:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  async function addVisit(
    visitData: CreateVisitRequest
  ) {
    try {
      const createdVisit =
        await VisitService.createVisit(
          visitData
        );

      const formattedVisit =
        mapVisitResponseToVisit(
          createdVisit
        );

      setVisits((prev) => [
        formattedVisit,
        ...prev,
      ]);
    } catch (error) {
      console.error(
        'Erro ao criar visita:',
        error
      );

      throw error;
    }
  }

  async function updateVisit(
    id: number,
    visitData: CreateVisitRequest
  ) {
    try {
      const updatedVisit =
        await VisitService.updateVisit(
          id,
          visitData
        );

      const formattedVisit =
        mapVisitResponseToVisit(
          updatedVisit
        );

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === id
            ? formattedVisit
            : visit
        )
      );
    } catch (error) {
      console.error(
        'Erro ao atualizar visita:',
        error
      );

      throw error;
    }
  }

  async function deleteVisit(id: number) {
    try {
      await VisitService.deleteVisit(id);

      setVisits((prev) =>
        prev.filter(
          (visit) => visit.id !== id
        )
      );
    } catch (error) {
      console.error(
        'Erro ao deletar visita:',
        error
      );

      throw error;
    }
  }

  return (
    <VisitContext.Provider
      value={{
        visits,
        loading,
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

export const useVisits = () =>
  useContext(VisitContext);