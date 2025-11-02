import api from '../utils/api';
import { USE_MOCK_DATA } from '../config';
import { mockUsers, mockBalance } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Settlement {
  id: string;
  payerId: string;
  receiverId: string;
  amount: number;
  date: string;
  groupId?: string;
  payer: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  receiver: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

export interface SettlementTransaction {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

export interface SimplifiedDebts {
  balances: Array<{
    userId: string;
    userName: string;
    netAmount: number;
  }>;
  simplified: SettlementTransaction[];
}

export interface CreateSettlementData {
  receiverId: string;
  amount: number;
  groupId?: string;
  date?: string;
}

export const settlementService = {
  getSettlements: async (groupId?: string): Promise<Settlement[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return [];
    }
    const response = await api.get('/settlements', { params: { groupId } });
    return response.data;
  },

  getSimplifiedDebts: async (groupId?: string): Promise<SimplifiedDebts> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return {
        balances: mockBalance.balances.map(b => ({
          userId: b.userId,
          userName: b.userName,
          netAmount: b.netAmount,
        })),
        simplified: [],
      };
    }
    const response = await api.get('/settlements/simplify', { params: { groupId } });
    return response.data;
  },

  createSettlement: async (data: CreateSettlementData): Promise<Settlement> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      const receiver = mockUsers.find(u => u.id === data.receiverId) || mockUsers[0];
      return {
        id: Date.now().toString(),
        ...data,
        payerId: mockUsers[0].id,
        date: data.date || new Date().toISOString(),
        payer: { id: mockUsers[0].id, name: mockUsers[0].name },
        receiver: { id: receiver.id, name: receiver.name },
      };
    }
    const response = await api.post('/settlements', data);
    return response.data;
  },
};

