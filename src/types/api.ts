export interface BaseResponse<T = any> {
  success: boolean;
  data: T | null;
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
  refreshToken: string;
  isActive: boolean;
  lastLoginDate?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string | null;
  mobilePhone?: string | null;
  address?: string | null;
  // Other optional fields from the API response
  [key: string]: any;
}

export interface LoginResponse extends BaseResponse {
  data: LoginResponseData;
}

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
  data: Devotion[] | null;
  totalCount: number;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChurchEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  isActive: boolean;
  isEligibleToCheckIn: boolean;
  eventImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  attendees?: Attendee[];
  penatalayans?: Penatalayan[];
}

export interface Attendee {
  id: number;
  user: User;
  churchEventId: number;
  checkInTime: string;
  createdAt: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
}

export interface Penatalayan {
  id: number;
  user: User;
  jenisPelayanan: string;
  churchEventId: number;
  createdAt: string;
  isActive: boolean;
  index: number;
}

export interface ChurchEventsResponse extends BaseResponse {
  data: ChurchEvent[] | null;
} 