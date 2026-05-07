import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Doctor, MOCK_DOCTORS } from '../mocks/docktors'; 

export interface Visit {
  id: string;
  doctorId: string; 
  doctor?: Doctor;  
  date: string;
  time: string;
  observations?: string;
  presentedMaterial?: string;
  status: 'scheduled' | 'completed';
}

interface VisitContextData {
  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id' | 'status'>) => void;
  updateVisit: (updated: Visit) => void;
  deleteVisit: (id: string) => void;
}

const VisitContext = createContext<VisitContextData>({} as VisitContextData);

export function VisitProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<Visit[]>([]); 

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
