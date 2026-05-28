import api from './api';

export interface PerformanceSummaryDTO {
  completedVisits: number;
  totalVisits: number;
}

export interface PerformanceStatsDTO {
  uniqueDoctorsVisited: number;
  targetDoctors: number;
}

class PerformanceService {
  async getSummary(repId: number): Promise<PerformanceSummaryDTO> {
    const response = await api.get(`/api/performance/summary?repId=${repId}`);
    return response.data;
  }

  async getStats(repId: number): Promise<PerformanceStatsDTO> {
    const response = await api.get(`/api/performance/stats?repId=${repId}`);
    return response.data;
  }

  async getPerformanceSummary(repId: number): Promise<PerformanceSummaryDTO> {
    return this.getSummary(repId);
  }

  async getPerformanceStats(repId: number): Promise<PerformanceStatsDTO> {
    return this.getStats(repId);
  }
}

export default new PerformanceService();
