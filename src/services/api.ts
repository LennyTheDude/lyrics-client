import axios from 'axios';
import type { AuthResponse, LoginFormData, SignupFormData } from '../types/auth';
import type { Translation, CreateTranslationData, UpdateTranslationData, Language, PaginatedResponse } from '../types/translation';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7777/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add accessToken
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', data);    
    return response.data;
  },

  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/signup', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/me');
    return response.data;
  },
};

// Translation API functions
export const translationAPI = {
  // Get all translations
  getTranslations: async (page: number = 1, limit: number = 10): Promise<{ translations: Translation[], total: number, page: number, limit: number, totalPages: number }> => {
    const response = await api.get<PaginatedResponse<Translation>>('/translations', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get a single translation by ID
  getTranslation: async (id: string): Promise<Translation> => {
    const response = await api.get<Translation>(`/translations/${id}`);
    return response.data;
  },

  // Create a new translation
  createTranslation: async (data: CreateTranslationData): Promise<Translation> => {
    const response = await api.post<Translation>('/translations', data);
    return response.data;
  },

  // Update a translation
  updateTranslation: async (id: string, data: UpdateTranslationData): Promise<Translation> => {
    const response = await api.put<Translation>(`/translations/${id}`, data);
    return response.data;
  },

  // Delete a translation
  deleteTranslation: async (id: string): Promise<void> => {
    await api.delete(`/translations/${id}`);
  },

  // Get available languages
  getLanguages: async (): Promise<Language[]> => {
    const response = await api.get<Language[]>('/languages');
    return response.data;
  },
};

export default api;
