export type Visit = {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
};

export const MOCK_VISITS: Visit[] = [
  {
    id: '1',
    doctorId: '5',
    date: '2026-04-18',
    time: '09:00',
  },
  {
    id: '2',
    doctorId: '4',
    date: '2026-04-18',
    time: '10:30',
  },
];