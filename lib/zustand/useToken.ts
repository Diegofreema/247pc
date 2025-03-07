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
  removeId: () => void;
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
        set((state) => ({ details: { id: state.details.id, token: '' } }));
      },
      removeId: async () => {
        set((state) => ({ details: { id: '', token: state.details.token } }));
      },
    }),
    { name: 'token', storage: createJSONStorage(() => AsyncStorage) }
  )
);
