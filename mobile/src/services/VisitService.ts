import api from './api';

export interface VisitResponse {
  id: number;
  doctorId: number;
  doctorName: string;
  userId: number;
  presentedMaterial?: string;
  date: string;
  time: string;
  observation?: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA';
}

export interface CreateVisitRequest {
  doctorId: number;
  userId: number;
  date: string;
  time: string;
  presentedMaterial?: string;
  observation?: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA';
}

class VisitService {
  async getAllVisits(): Promise<VisitResponse[]> {
    const response = await api.get('/visits');

    return response.data;
  }

  async createVisit(
    data: CreateVisitRequest
  ): Promise<VisitResponse> {
    const response = await api.post('/visits', data);

    return response.data;
  }

  async updateVisit(
    id: number,
    data: CreateVisitRequest
  ): Promise<VisitResponse> {
    const response = await api.put(
      `/visits/${id}`,
      data
    );

    return response.data;
  }

  async deleteVisit(id: number): Promise<void> {
    await api.delete(`/visits/${id}`);
  }
}

export default new VisitService();