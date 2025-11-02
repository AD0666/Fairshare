import api from '../utils/api';
import { USE_MOCK_DATA } from '../config';
import { mockBalance, mockStats } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface BalanceEntry {
  userId: string;
  userName: string;
  userProfilePicture?: string;
  totalOwed: number;
  totalReceiving: number;
  netAmount: number;
}

export interface BalanceData {
  balances: BalanceEntry[];
  summary: {
    totalOwed: number;
    totalReceiving: number;
    netAmount: number;
  };
}

export interface StatsData {
  categoryBreakdown: Array<{
    category: string;
    total: number;
    count: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    total: number;
    count: number;
  }>;
  totals: {
    totalSpent: number;
    totalPaid: number;
    difference: number;
  };
}

export const dashboardService = {
  getBalance: async (): Promise<BalanceData> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockBalance;
    }
    const response = await api.get('/dashboard/balance');
    return response.data;
  },

  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
    groupId?: string;
  }): Promise<StatsData> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockStats;
    }
    const response = await api.get('/dashboard/stats', { params });
    return response.data;
  },
};

