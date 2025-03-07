import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore {
  details: {
    token: string;
    id: string;
  };
  setToken: (token: string) => void;
  setId: (id: string) => void;
  removeToken: () => void;
}

export const useToken = create<AuthStore>()(
  persist(
    (set) => ({
      details: {
        token: '',
        id: '',
      },
      setToken: async (token) => {
        set((state) => ({ details: { token, id: state.details.id } }));
      },
      setId: async (id) => {
        set((state) => ({ details: { token: state.details.token, id } }));
      },
      removeToken: async () => {
        set({ details: { id: '', token: '' } });
      },
    }),
    { name: 'token', storage: createJSONStorage(() => AsyncStorage) }
  )
);
