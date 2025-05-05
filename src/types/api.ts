export interface BaseResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  dob: string;
}

export type LoginResponse = BaseResponse<LoginResponseData>;

export interface Devotion {
  id: number;
  date: string;
  title: string;
  subtitle: string;
  book: string;
  videoUrl: string;
  content: string;
  createdAt: string;
  isActive: boolean;
  totalViews: number;
}

export interface DevotionsResponse {
  success: boolean;
  data: Devotion[];
  totalCount: number;
  message: string;
} 