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
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
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
  data: Devotion[];
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
  isEligibleToCheckIn: boolean;
  eventImageUrl: string;
  createdAt: string;
  isActive: boolean;
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
  data: ChurchEvent[];
} 