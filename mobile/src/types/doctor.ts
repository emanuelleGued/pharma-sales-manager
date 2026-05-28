export type Doctor = {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  location: string;
  clinicName: string;
  status: 'SEM_VISITAS' | 'PENDENTE' | 'VISITADO';
};
