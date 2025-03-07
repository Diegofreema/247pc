import { usePathname, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text } from 'react-native-paper';
import { useUser } from '../lib/queries';
import { useStoreId } from '../lib/zustand/auth';

type Props = {
  title?: string;
  back?: boolean;
  white?: boolean;
};

const NavigationHeader = ({ title, back, white }: Props) => {
  const router = useRouter();
  const { id } = useStoreId();
  const pathname = usePathname();

  const { data: user } = useUser(id);
  // const loading = isPending;
  // useEffect(() => {
  //   refetch();
  // }, []);
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
          onPress={() => router.back()}
          style={({ pressed }) => [pressed && { opacity: 0.5 }, { padding: 3 }]}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
      )}
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'PoppinsBold',
          color: white ? '#fff' : '#000',
          textAlign: 'center',
          maxWidth: 180,
        }}
      >
        {title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {pathname !== '/cart' && (
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.5 },
              { padding: 5 },
            ]}
            onPress={() => router.push('/cart')}
          >
            {id && (
              <FontAwesome
                name="shopping-cart"
                size={25}
                color={white ? '#fff' : '#000'}
              />
            )}
            {id && (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'green',
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  top: -5,
                  right: -6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {user ? (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 10,
                      fontFamily: 'Poppins',
                    }}
                  >
                    {user?.productInCart}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 10,
                      fontFamily: 'Poppins',
                    }}
                  >
                    {0}
                  </Text>
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
