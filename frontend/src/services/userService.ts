import api from '../utils/api';
import { User } from './authService';
import { USE_MOCK_DATA } from '../config';
import { mockUsers, mockFriends } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  searchUsers: async (email: string): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockUsers.filter(u => 
        u.email.toLowerCase().includes(email.toLowerCase()) && 
        u.id !== mockUsers[0].id
      );
    }
    const response = await api.get(`/users/search?email=${email}`);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return { ...mockUsers[0], ...data };
    }
    const response = await api.put('/users/profile', data);
    return response.data.user;
  },

  getUserById: async (id: string): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockUsers.find(u => u.id === id) || mockUsers[0];
    }
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getFriends: async (): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockFriends;
    }
    const response = await api.get('/users/friends');
    return response.data;
  },

  addFriend: async (friendId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.post(`/users/friends/${friendId}`);
  },

  removeFriend: async (friendId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.delete(`/users/friends/${friendId}`);
  },
};

