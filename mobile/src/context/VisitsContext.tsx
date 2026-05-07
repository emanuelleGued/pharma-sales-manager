import React, { createContext, useContext, useState } from 'react';
import { MOCK_VISITS, Visit } from '../mocks/visits';

type VisitsContextType = {
  visits: Visit[];
  deleteVisit: (id: string) => void;
  updateVisit: (updated: Visit) => void;
};

const VisitsContext = createContext<VisitsContextType>({} as VisitsContextType);

export function VisitsProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);

  const deleteVisit = (id: string) =>
    setVisits((prev) => prev.filter((v) => v.id !== id));

  const updateVisit = (updated: Visit) =>
    setVisits((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));

  return (
    <VisitsContext.Provider value={{ visits, deleteVisit, updateVisit }}>
      {children}
    </VisitsContext.Provider>
  );
}

export const useVisits = () => useContext(VisitsContext);