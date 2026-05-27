import api from './api';

export interface VisitResponse {
  id: number;
  doctorId: number;
  doctorName: string;
  userId: number;
  presentedMaterial?: string;
  date: string;
  observation?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'RESCHEDULED';
}

export interface CreateVisitRequest {
  doctorId: number;
  userId: number;
  date: string;
  presentedMaterial?: string;
  observation?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'RESCHEDULED';
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