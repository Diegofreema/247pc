import { Redirect, Stack } from 'expo-router';
import { useStoreId } from '../../lib/zustand/auth';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  const { id, getId } = useStoreId();
  useEffect(() => {
    getId();
  }, []);
  if (id !== '') {
    return <Redirect href={'/'} />;
  }
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
