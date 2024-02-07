import { Redirect, Stack } from 'expo-router';
import { useStoreId } from '../../lib/zustand/auth';
import { useEffect } from 'react';
import { getProfile } from '../../lib/helpers';
import { useQueryClient } from '@tanstack/react-query';

export default function AppLayoutNav() {
  const { id, getId, setUser } = useStoreId();
  console.log('🚀 ~ AppLayoutNav ~ id:', id);
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, []);
  useEffect(() => {
    getId();
    const getData = async () => {
      const user = await getProfile(id);
      setUser(user);
    };
    getData();
  }, []);

  if (id === '') {
    return <Redirect href={'/login'} />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />

      <Stack.Screen name="updateProfile" options={{ headerShown: false }} />
      <Stack.Screen name="updatePassword" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[productId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="special/[specialId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="category/[category]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="chief/[category]" options={{ headerShown: false }} />
      <Stack.Screen name="seller/[sellerId]" options={{ headerShown: false }} />
      <Stack.Screen
        name="sellerCat/[category]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="wallet" options={{ headerShown: false }} />

      <Stack.Screen name="order" options={{ headerShown: false }} />
    </Stack>
  );
}
