import api from '../utils/api';
import { USE_MOCK_DATA } from '../config';
import { mockUsers } from './mockData';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Simulate delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      const user = mockUsers[0]; // Mock current user
      return {
        user,
        token: 'mock-jwt-token',
        message: 'Login successful',
      };
    }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      const user: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        phone: undefined,
        profilePicture: undefined,
      };
      return {
        user,
        token: 'mock-jwt-token',
        message: 'Registration successful',
      };
    }
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockUsers[0];
    }
    const response = await api.get('/auth/me');
    return response.data;
  },
};

