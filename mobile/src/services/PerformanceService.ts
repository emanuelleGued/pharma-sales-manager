import api from './api';

export interface PerformanceSummaryDTO {
  completedVisits: number;
  totalVisits: number;
}

export interface PerformanceMetricsDTO {
  uniqueDoctorsVisited: number;
  targetDoctors: number;
}

class PerformanceService {
  async getSummary(repId: number): Promise<PerformanceSummaryDTO> {
    const response = await api.get(`/performance/summary?repId=${repId}`);
    return response.data;
  }

  async getMetrics(repId: number): Promise<PerformanceMetricsDTO> {
    const response = await api.get(`/performance/metrics?repId=${repId}`);
    return response.data;
  }

  async getPerformanceSummary(repId: number): Promise<PerformanceSummaryDTO> {
    return this.getSummary(repId);
  }

  async getPerformanceMetrics(repId: number): Promise<PerformanceMetricsDTO> {
    return this.getMetrics(repId);
  }
}

export default new PerformanceService();
