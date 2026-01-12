import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        // Switch cart to user's cart
        useCartStore.getState().switchUser(user._id);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        // Switch cart to guest cart
        useCartStore.getState().switchUser(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // When auth store rehydrates, sync cart with user
        if (state?.user?._id) {
          // Delay to ensure cartStore is ready
          setTimeout(() => {
            useCartStore.getState().switchUser(state.user?._id || null);
          }, 0);
        }
      },
    }
  )
);
