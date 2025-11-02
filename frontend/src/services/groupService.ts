import api from '../utils/api';
import { User } from './authService';
import { USE_MOCK_DATA } from '../config';
import { mockGroups, mockUsers } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Group {
  id: string;
  name: string;
  image?: string;
  createdBy: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  members: Array<{
    id: string;
    userId: string;
    joinedAt: string;
    user: User;
  }>;
  _count?: {
    expenses: number;
  };
}

export interface CreateGroupData {
  name: string;
  image?: string;
  memberIds?: string[];
}

export const groupService = {
  getGroups: async (): Promise<Group[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockGroups;
    }
    const response = await api.get('/groups');
    return response.data;
  },

  getGroupById: async (id: string): Promise<Group> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockGroups.find(g => g.id === id) || mockGroups[0];
    }
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (data: CreateGroupData): Promise<Group> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return {
        id: Date.now().toString(),
        ...data,
        createdBy: mockUsers[0].id,
        createdAt: new Date().toISOString(),
        creator: { id: mockUsers[0].id, name: mockUsers[0].name },
        members: [],
        _count: { expenses: 0 },
      };
    }
    const response = await api.post('/groups', data);
    return response.data;
  },

  updateGroup: async (id: string, data: Partial<Group>): Promise<Group> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return { ...mockGroups.find(g => g.id === id)!, ...data } as Group;
    }
    const response = await api.put(`/groups/${id}`, data);
    return response.data;
  },

  deleteGroup: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.delete(`/groups/${id}`);
  },

  addMember: async (groupId: string, userIds: string[]): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.post(`/groups/${groupId}/members`, { userIds });
  },

  removeMember: async (groupId: string, userId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.delete(`/groups/${groupId}/members/${userId}`);
  },
};

