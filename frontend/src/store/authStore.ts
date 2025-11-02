import { create } from 'zustand';
import { User } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  isAuthenticated: () => !!get().token && !!get().user,
}));

// Load user from localStorage on mount
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');
if (storedUser && storedToken) {
  useAuthStore.setState({
    user: JSON.parse(storedUser),
    token: storedToken,
  });
}

