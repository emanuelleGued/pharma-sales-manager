import { Platform } from 'react-native';
import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
const API_BASE_URL =
  debuggerHost
    ? `http://${debuggerHost}:8080/api`
    : Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api'
      : 'http://localhost:8080/api';

export interface DoctorResponse {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  clinicName: string;
  location: string;
  status: 'SEM_VISITAS' | 'PENDENTE' | 'VISITADO';
}

export interface CreateDoctorRequest {
  name: string;
  crm: string;
  specialty: string;
  clinicName: string;
  location: string;
}

/**
 * Service para gerenciar requisições relacionadas a Médicos
 */
class DoctorService {
  /**
   * Busca a lista de todos os médicos ou filtra por um termo de busca
   * @param search - Termo de busca opcional (nome ou especialidade)
   * @returns Lista de médicos
   */
  async getAllDoctors(search?: string): Promise<DoctorResponse[]> {
    try {
      const url = search
        ? `${API_BASE_URL}/doctors?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/doctors`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar médicos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      throw error;
    }
  }

  /**
   * Busca um médico específico pelo ID
   * @param id - ID do médico
   * @returns Dados do médico
   */
  async getDoctorById(id: string): Promise<DoctorResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar médico: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar médico com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo médico
   * @param request - Dados do novo médico
   * @returns Dados do médico criado
   */
  async createDoctor(request: CreateDoctorRequest): Promise<DoctorResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ao criar médico: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar médico:', error);
      throw error;
    }
  }
}

export default new DoctorService();
