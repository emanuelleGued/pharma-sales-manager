import { Platform } from 'react-native';

const LOCAL_API_URL = Platform.OS === 'android'
  ? 'http://192.168.1.14:8080/api' 
  : 'http://localhost:8080/api';

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || LOCAL_API_URL,
  TIMEOUT: 30000,

  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, 

  ENDPOINTS: {
    DOCTORS: '/doctors',
    DOCTOR_BY_ID: (id: string) => `/doctors/${id}`,
    SEARCH_DOCTORS: (query: string) => `/doctors?search=${encodeURIComponent(query)}`,

  },
};

export function buildURL(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

export function getDefaultHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: unknown
): Promise<T> {
  try {
    const url = buildURL(endpoint);
    const options: RequestInit = {
      method,
      headers: getDefaultHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição ${method} ${endpoint}:`, error);
    throw error;
  }
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  error?: string;
}

// ============================================
// CONFIGURAÇÕES POR AMBIENTE
// ============================================

/*
// Development
const DEV_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 30000,
  DEBUG: true,
};

// Production
const PROD_CONFIG = {
  BASE_URL: 'https://api.pharmasales.com/api',
  TIMEOUT: 10000,
  DEBUG: false,
};

// Selecionar configuração baseado no ambiente
const currentEnv = process.env.NODE_ENV || 'development';
export const API_CONFIG = currentEnv === 'production' ? PROD_CONFIG : DEV_CONFIG;
*/

// ============================================
// VARIÁVEIS DE AMBIENTE EXPO (EXPO_PUBLIC_)
// ============================================

/*
Criar arquivo .env no diretório raiz do projeto mobile:

// .env
EXPO_PUBLIC_API_URL=http://192.168.1.14:8080/api
EXPO_PUBLIC_DEBUG=true

// .env.production
EXPO_PUBLIC_API_URL=https://api.pharmasales.com/api
EXPO_PUBLIC_DEBUG=false

Acessar no código:
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const debug = process.env.EXPO_PUBLIC_DEBUG === 'true';
*/
