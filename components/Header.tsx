import { Pressable, StyleSheet, View } from 'react-native';

import { Searchbar, Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { usePathname, useRouter } from 'expo-router';
import Profile from './Profile';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../constants/Colors';
import { LoggedUserType } from '../lib/types';
import { useStoreId } from '../lib/zustand/auth';
import { useUser, useWalletBalance } from '../lib/queries';
import { MyButton } from './MyButton';
import { useState } from 'react';

type Props = {
  user?: LoggedUserType;
  loading?: boolean;
};

const Header = ({}: Props) => {
  const { id } = useStoreId();
  const pathname = usePathname();
  const {
    data: walletBalance,
    isFetching: walletBalanceIsFetching,
    isPaused,
    isPending: walletBalanceIsPending,
    isError: walletBalanceIsError,
  } = useWalletBalance();
  const {
    data: user,
    isFetching,
    isPending,
    isPaused: userIsPaused,
    isError,
    refetch,
  } = useUser(id);

  const isLoggedIn = user ? true : false;
  const loading =
    walletBalanceIsFetching ||
    isFetching ||
    isPending ||
    walletBalanceIsPending;
  const router = useRouter();
  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  if (isPaused || userIsPaused) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }
  if (isError || walletBalanceIsError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }

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
      {!loading && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginLeft: 10,
            marginTop: 15,
          }}
        >
          <FontAwesome name="money" size={25} color="#fff" />
          <Text style={{ color: 'white' }}>Your Balance: ₦{walletBalance}</Text>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
