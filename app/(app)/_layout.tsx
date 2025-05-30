import { type ErrorBoundaryProps, Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorComponent } from '../../components/ErrorComponent';
import { Loader } from '../../components/Loader';
import { useGetProfile } from '../../lib/queries';
import { useStoreId } from '../../lib/zustand/auth';

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} />;
}
export default function AppLayoutNav() {
  const { id } = useStoreId();

  const { isPending } = useGetProfile(id);
  if (id === '') {
    return <Redirect href={'/login'} />;
  }

  if (isPending) {
    return <Loader />;
  }
  return (
    <>
      <StatusBar style="dark" />

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
        <Stack.Screen
          name="chief/[category]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="seller/[sellerId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sellerCat/[category]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="wallet" options={{ headerShown: false }} />

        <Stack.Screen name="order" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
