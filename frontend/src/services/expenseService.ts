import api from '../utils/api';
import { USE_MOCK_DATA } from '../config';
import { mockExpenses, mockUsers } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ExpenseSplit {
  userId: string;
  amount?: number;
  percentage?: number;
  shares?: number;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  payerId: string;
  payer: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  createdBy: string;
  creator: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  groupId?: string;
  receiptImage?: string;
  splits: Array<{
    id: string;
    userId: string;
    amountOwed: number;
    user: {
      id: string;
      name: string;
      profilePicture?: string;
    };
  }>;
}

export interface CreateExpenseData {
  amount: number;
  description: string;
  date: string;
  category: string;
  payerId: string;
  groupId?: string;
  receiptImage?: string;
  splitType: 'equal' | 'unequal' | 'percentage' | 'shares';
  splits: ExpenseSplit[];
}

export interface UpdateExpenseData {
  amount?: number;
  description?: string;
  date?: string;
  category?: string;
  payerId?: string;
  splits?: Array<{ userId: string; amount: number }>;
}

export const expenseService = {
  getExpenses: async (params?: {
    groupId?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Expense[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      let expenses = [...mockExpenses];
      if (params?.limit) {
        expenses = expenses.slice(0, params.limit);
      }
      return expenses;
    }
    const response = await api.get('/expenses', { params });
    return response.data as Expense[];
  },

  getExpenseById: async (id: string): Promise<Expense> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockExpenses.find(e => e.id === id) || mockExpenses[0];
    }
    const response = await api.get(`/expenses/${id}`);
    return response.data as Expense;
  },

  createExpense: async (data: CreateExpenseData): Promise<Expense> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      const payer = mockUsers.find(u => u.id === data.payerId) || mockUsers[0];
      const creator = mockUsers[0]; // Mock creator - in real app, this comes from auth
      return {
        id: Date.now().toString(),
        amount: data.amount,
        description: data.description,
        date: data.date,
        category: data.category,
        payerId: data.payerId,
        payer: { id: payer.id, name: payer.name },
        createdBy: creator.id,
        creator: {
          id: creator.id,
          name: creator.name,
          profilePicture: creator.profilePicture,
        },
        groupId: data.groupId,
        receiptImage: data.receiptImage,
        splits: data.splits.map((split, idx) => ({
          id: (Date.now() + idx).toString(),
          userId: split.userId,
          amountOwed: split.amount || data.amount / data.splits.length,
          user: mockUsers.find(u => u.id === split.userId) || mockUsers[0],
        })),
      };
    }
    const response = await api.post('/expenses', data);
    return response.data as Expense;
  },

  updateExpense: async (id: string, data: UpdateExpenseData): Promise<Expense> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const existing = mockExpenses.find(e => e.id === id)!;
      const updatedPayerId = data.payerId ?? existing.payerId;
      const updatedPayer = mockUsers.find(u => u.id === updatedPayerId) || existing.payer;
      const updatedSplits = data.splits
        ? data.splits.map((split, idx) => ({
            id: `${id}-split-${idx}`,
            userId: split.userId,
            amountOwed: split.amount,
            user: mockUsers.find(u => u.id === split.userId) || mockUsers[0],
          }))
        : existing.splits;
      return {
        ...existing,
        amount: data.amount ?? existing.amount,
        description: data.description ?? existing.description,
        date: data.date ?? existing.date,
        category: data.category ?? existing.category,
        payerId: updatedPayerId,
        payer: { id: updatedPayer.id, name: updatedPayer.name },
        splits: updatedSplits,
      };
    }
    const response = await api.put(`/expenses/${id}`, data);
    return response.data as Expense;
  },

  deleteExpense: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    await api.delete(`/expenses/${id}`);
  },
};

