import axios from 'axios';
import { BaseResponse, LoginResponse, LoginCredentials, DevotionsResponse, Devotion, ChurchEventsResponse, ChurchEvent } from '../types/api';
import { storeUserInfo } from '@/utils/auth';

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

// Add a response interceptor to handle 403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Clear token and redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Data contains the user directly with accessToken
      if (response.data.success && response.data.data) {
        storeUserInfo(response.data.data);
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

export const churchEventService = {
  getChurchEvents: async (): Promise<ChurchEventsResponse> => {
    try {
      const response = await api.get<ChurchEventsResponse>('/church-events');
      // No longer transforming URLs - use them as-is from the API
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createChurchEvent: async (event: FormData): Promise<BaseResponse<ChurchEvent>> => {
    try {
      const response = await api.post<BaseResponse<ChurchEvent>>('/church-events', event, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteChurchEvent: async (id: number): Promise<BaseResponse<void>> => {
    try {
      const response = await api.delete<BaseResponse<void>>(`/church-events/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateChurchEvent: async (id: number, event: FormData): Promise<BaseResponse<ChurchEvent>> => {
    try {
      const response = await api.put<BaseResponse<ChurchEvent>>(`/church-events/${id}`, event, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating church event:', error);
      throw error;
    }
  },

  getChurchEventById: async (id: number): Promise<BaseResponse<ChurchEvent>> => {
    try {
      const response = await api.get<BaseResponse<ChurchEvent>>(`/church-events/${id}`);
      // No longer transforming URLs - use them as-is from the API
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 