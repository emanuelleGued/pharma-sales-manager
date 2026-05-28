export type Visit = {
  id: string;
  date: string;
  time: string;
  observation: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA';
  doctorId: string;
  userId: string;
};