import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useStoreId } from '../../lib/zustand/auth';

export default function AuthLayout() {
  const { id } = useStoreId();

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
