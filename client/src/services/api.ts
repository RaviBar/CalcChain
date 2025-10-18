import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  CreateCalculationRequest, 
  Calculation,
  User 
} from '../types';

const API_BASE_URL = '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const calculationsAPI = {
  getAll: async (): Promise<{ calculations: Calculation[]; user: User | null }> => {
    const response = await api.get('/calculations');
    return response.data;
  },

  create: async (calculationData: CreateCalculationRequest): Promise<{ calculation: Calculation }> => {
    const response = await api.post('/calculations', calculationData);
    return response.data;
  },

  getChildren: async (id: number): Promise<{ children: Calculation[] }> => {
    const response = await api.get(`/calculations/${id}/children`);
    return response.data;
  },
};

export default api;
