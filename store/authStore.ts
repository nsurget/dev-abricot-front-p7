import { create } from 'zustand';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  sub: string;
  email: string;
  name?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    Cookies.set('auth_token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('auth_token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
          Cookies.remove('auth_token');
          set({ token: null, user: null, isAuthenticated: false });
        } else {
          // Si on a un token valide mais pas de user en state, on pourrait fetch le profile
          // Pour l'instant on garde juste l'état authentifié
          set({ token, isAuthenticated: true });
        }
      } catch (error) {
        Cookies.remove('auth_token');
        set({ token: null, user: null, isAuthenticated: false });
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      }
    }
  },
}));
