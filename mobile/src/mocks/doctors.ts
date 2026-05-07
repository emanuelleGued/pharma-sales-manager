export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  clinicName: string;
  visited: boolean;
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Marcos Silva',
    specialty: 'Cardiologista',
    location: 'São Paulo, SP',
    clinicName: 'Clínica do Coração',
    visited: true,
  },
  {
    id: '2',
    name: 'Dra. Ana Paula Costa',
    specialty: 'Pediatra',
    location: 'São Paulo, SP',
    clinicName: 'Clínica Infantil',
    visited: true,
  },
  {
    id: '3',
    name: 'Dr. Roberto Santos',
    specialty: 'Ortopedista',
    location: 'Campinas, SP',
    clinicName: 'OrtoCenter',
    visited: false,
  },
  {
    id: '4',
    name: 'Dra. Fernanda Lima',
    specialty: 'Dermatologista',
    location: 'São Paulo, SP',
    clinicName: 'Pele e Cia',
    visited: true,
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Clínico Geral',
    location: 'Guarulhos, SP',
    clinicName: 'Saúde Total',
    visited: false,
  },
  {
    id: '6',
    name: 'Dra. Juliana Ribeiro',
    specialty: 'Ginecologista',
    location: 'São Bernardo do Campo, SP',
    clinicName: 'Saúde da Mulher',
    visited: false,
  },
  {
    id: '7',
    name: 'Dr. Ricardo Almeida',
    specialty: 'Neurologista',
    location: 'Osasco, SP',
    clinicName: 'Neuro Vida',
    visited: false,
  },
  {
    id: '8',
    name: 'Dra. Mariana Costa',
    specialty: 'Oftalmologista',
    location: 'Santo André, SP',
    clinicName: 'Visão Perfeita',
    visited: true,
  }
];
