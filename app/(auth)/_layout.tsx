import { Redirect, Stack } from 'expo-router';
import { useStoreId } from '../../lib/zustand/auth';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { id, getId } = useStoreId();
  useEffect(() => {
    getId();
  }, []);
  if (id !== '') {
    return <Redirect href={'/'} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
