import axios from 'axios';
import { BaseResponse, LoginResponse, LoginCredentials, DevotionsResponse, Devotion } from '../types/api';

const API_URL = 'https://api-shepherd.jar-vis.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      // Store token in localStorage
      if (response.data.success && response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const devotionService = {
  getDevotions: async (offset: number = 0, limit: number = 10): Promise<DevotionsResponse> => {
    try {
      const response = await api.get<DevotionsResponse>(`/devotions?offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDevotionById: async (id: number): Promise<BaseResponse<Devotion>> => {
    try {
      const response = await api.get<BaseResponse<Devotion>>(`/devotions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDevotion: async (devotion: Omit<Devotion, 'id' | 'createdAt' | 'totalViews'>): Promise<BaseResponse<Devotion>> => {
    try {
      const response = await api.post<BaseResponse<Devotion>>('/devotions', devotion);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDevotion: async (id: number, devotion: Omit<Devotion, 'id' | 'createdAt' | 'totalViews'>): Promise<BaseResponse<Devotion>> => {
    try {
      console.log('Making PUT request to:', `/devotions/${id}`);
      console.log('Request data:', devotion);
      
      const response = await api.put<BaseResponse<Devotion>>(`/devotions/${id}`, devotion);
      console.log('PUT response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('PUT request failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
};

export default api; 