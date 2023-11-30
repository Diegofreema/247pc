import { Pressable, StyleSheet, View } from 'react-native';

import { Searchbar, Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { usePathname, useRouter } from 'expo-router';
import Profile from './Profile';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../constants/Colors';
import { LoggedUserType } from '../lib/types';
import { useStoreId } from '../lib/zustand/auth';
import { useUser } from '../lib/queries';

type Props = {
  user?: LoggedUserType;
  loading?: boolean;
};

const Header = ({}: Props) => {
  const { id } = useStoreId();
  const pathname = usePathname();
  const { data: user, isLoading, isFetching, isPending } = useUser(id);

  const isLoggedIn = user ? true : false;
  const loading = isLoading || isFetching || isPending;
  const router = useRouter();

  return (
    <View
      style={{
        marginTop: 10,
        paddingBottom: 15,
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
          gap: 10,
          marginHorizontal: 10,
          paddingVertical: 20,
        }}
      >
        <Text
          style={{
            flex: 1,
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Account
        </Text>

        <Pressable onPress={() => router.push('/cart')}>
          <FontAwesome
            name="shopping-cart"
            style={{ marginRight: 5 }}
            size={25}
            color={'#fff'}
          />
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
                <Text>0</Text>
              ) : (
                <Text style={{ color: '#fff' }}>{user?.productInCart}</Text>
              )}
            </View>
          )}
        </Pressable>
      </View>

      <Profile
        isLoggedIn={isLoggedIn}
        name={user?.customername}
        email={user?.email}
        loading={loading}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
