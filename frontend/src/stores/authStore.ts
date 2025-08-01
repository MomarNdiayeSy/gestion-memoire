import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'ENCADREUR' | 'ETUDIANT';
  nom: string;
  prenom: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Pas de token : on considère l'utilisateur comme non authentifié
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    try {
      const response = await api.get('/auth/me');
      const received = response.data;
      const currentUser = received.user ?? received;
      // On conserve le token existant
      set({ user: currentUser, token, isAuthenticated: true });
    } catch (error) {
      console.error('Check auth error:', error);
      // Token invalide : on le supprime et on réinitialise le store
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

// Hook personnalisé pour utiliser le store d'authentification
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    token: store.token,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
  };
};

export default useAuthStore; 