import { View, Pressable, Linking } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useStoreId } from '../lib/zustand/auth';
import { useUser } from '../lib/queries';
import { colors } from '../constants/Colors';
import { EventRegister } from 'react-native-event-listeners';
import Animated, {
  BounceIn,
  BounceOut,
  FadeInUp,
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
  title?: string;
  back?: boolean;
};

const links = [
  {
    name: 'Home',
    href: '/(tabs)/',
  },
  {
    name: 'Categories',
    href: '/(tabs)/categories',
  },
  {
    name: 'Wishlist',
    href: '/(tabs)/wishlist',
  },
  {
    name: 'Account',
    href: '/(tabs)/account',
  },
];

const NavigationHeader = ({ title, back }: Props) => {
  const router = useRouter();
  const { id } = useStoreId();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<View>(null);

  const { data: user, isLoading, isFetching, isPending } = useUser(id);
  const loading = isLoading || isFetching || isPending;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 25,
      }}
    >
      {back && (
        <Pressable
          onPress={({}) => router.back()}
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
      )}
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
        {title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {pathname !== '/cart' && (
          <Pressable onPress={() => router.push('/cart')}>
            {id && (
              <FontAwesome name="shopping-cart" size={25} color={'#000'} />
            )}
            {user && (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'green',
                  borderRadius: 10,
                  width: 20,
                  top: -10,
                  right: -6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff' }}>{user?.productInCart}</Text>
                )}
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default NavigationHeader;
