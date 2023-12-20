import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import moment from 'moment';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  AppState,
  AppStateStatic,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStoreId } from '../lib/zustand/auth';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const { removeUser, removeId } = useStoreId();
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const handleLogout = async () => {
    console.log('handleLogout');
    removeUser();
    removeId();

    await AsyncStorage.removeItem('logoutTimestamp');

    router.replace('/');
  };

  useEffect(() => {
    const getLogoutTime = async () => {
      const logoutTimestamp = await AsyncStorage.getItem('logoutTimestamp');
      if (!logoutTimestamp) return;

      const remainingTime = parseInt(logoutTimestamp) - new Date().getTime();
      if (remainingTime <= 0) {
        handleLogout();
      }
    };
    getLogoutTime();
  }, [AsyncStorage, handleLogout]);
  // useEffect(() => {
  //   async function onFetchUpdateAsync() {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();

  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         await Updates.reloadAsync();
  //       }
  //     } catch (error) {
  //       // You can also add an alert() to see the error message in case of an error when fetching updates.
  //       console.log(error);
  //     }
  //   }
  //   onFetchUpdateAsync();
  // }, []);
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
const MyTheme = {
  ...DefaultTheme,
  backgroundColor: '#ffffff',
};

function RootLayoutNav() {
  const pathname = usePathname();

  return (
    <ThemeProvider value={MyTheme}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      >
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />

          <Stack.Screen
            name="signup"
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="forgot" options={{ headerShown: false }} />
          <Stack.Screen name="updateProfile" options={{ headerShown: false }} />
          <Stack.Screen
            name="updatePassword"
            options={{ headerShown: false }}
          />
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
          <Stack.Screen name="(join)/join" options={{ headerShown: false }} />
          <Stack.Screen name="(join)/sell" options={{ headerShown: false }} />
          <Stack.Screen
            name="(join)/practitioner"
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="terms" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
}
