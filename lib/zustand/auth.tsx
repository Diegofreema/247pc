import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedUserType } from '../types';

interface AuthStore {
  id: string;
  setId: (id: string) => void;
  removeId: () => void;
  getId: () => void;
  user: LoggedUserType | undefined;
  setUser: (user: LoggedUserType | {}) => void;
  removeUser: () => void;
  getUser: () => void;
}

export const useStoreId = create<AuthStore>((set) => ({
  id: '',
  setId: async (newId) => {
    set({ id: newId });
    try {
      await AsyncStorage.setItem('id', newId.toString());
      console.log('ID stored in local storage:', newId);
    } catch (error) {
      console.error('Error storing ID in local storage:', error);
    }
  },
  removeId: async () => {
    set({ id: '', user: undefined });
    try {
      await AsyncStorage.removeItem('id');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing ID from local storage:', error);
    }
  },
  getId: async () => {
    try {
      const id = (await AsyncStorage.getItem('id')) || '';
      set({ id: id });
    } catch (error) {
      console.error('Error getting ID from local storage:', error);
      return null;
    }
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
  getUser: async () => {
    try {
      const data = (await AsyncStorage.getItem('user')) as any;
      const user = JSON.parse(data);
      set({ user: user });
    } catch (error) {
      console.error('Error getting User from local storage:', error);
    }
  },
}));
