import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedUserType } from '../types';

interface AuthStore {
  id: string;
  setId: (id: string) => void;
  removeId: () => void;

  user: LoggedUserType | undefined;
  setUser: (user: LoggedUserType | {}) => void;
  removeUser: () => void;
}

export const useStoreId = create<AuthStore>()(
  persist(
    (set) => ({
      id: '',
      setId: async (newId) => {
        set({ id: newId });
      },
      removeId: async () => {
        set({ id: '', user: undefined });
      },

      user: undefined,
      setUser: async (user: any) => {
        try {
          await AsyncStorage.setItem('user', JSON.stringify(user));
          set({ user: user });
        } catch (error) {
          console.error('Error storing User in local storage:', error);
        }
      },
      removeUser: async () => {
        set({ user: undefined });
        try {
          await AsyncStorage.removeItem('user');
        } catch (error) {
          console.error('Error removing User from local storage:', error);
        }
      },
    }),
    { name: 'auth', storage: createJSONStorage(() => AsyncStorage) }
  )
);
