import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Doctor } from '../mocks/doctors';

// Definindo como é o formato de uma Visita no nosso app
export interface Visit {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  observations: string;
  status: 'scheduled' | 'completed'; // Para podermos marcar como concluída depois
}

// Definindo o que o nosso Contexto vai exportar para as telas
interface VisitContextData {
  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id' | 'status'>) => void;
}

const VisitContext = createContext<VisitContextData>({} as VisitContextData);

export function VisitProvider({ children }: { children: ReactNode }) {
  // Estado global que guarda a lista de visitas
  const [visits, setVisits] = useState<Visit[]>([]);

  // Função para adicionar uma nova visita
  const addVisit = (visitData: Omit<Visit, 'id' | 'status'>) => {
    const newVisit: Visit = {
      ...visitData,
      id: Math.random().toString(36).substring(2, 9), // Gera um ID aleatório simples
      status: 'scheduled', // Toda nova visita começa como agendada
    };
    
    setVisits((prevVisits) => [...prevVisits, newVisit]);
  };

  return (
    <VisitContext.Provider value={{ visits, addVisit }}>
      {children}
    </VisitContext.Provider>
  );
}

export const useVisits = () => {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error('useVisits deve ser usado dentro de um VisitProvider');
  }
  return context;
};