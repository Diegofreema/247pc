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
import NavigationHeader from './NavigationHeader';

type Props = {
  user?: LoggedUserType;
  loading?: boolean;
};

const Header = ({}: Props) => {
  const { id, user: profile } = useStoreId();

  const {
    data: user,

    isPending,
    isPaused: userIsPaused,
    isError,
    refetch,
  } = useUser(id);
  const {
    data: walletBalance,

    isPaused,
    isPending: walletBalanceIsPending,
    isError: walletBalanceIsError,
  } = useWalletBalance();

  const loading = isPending || walletBalanceIsPending;

  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  if (isPaused || userIsPaused) {
    return (
      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text
          style={{ fontFamily: 'PoppinsMedium', fontSize: 20, color: 'black' }}
        >
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
          alignItems: 'center',
          gap: 8,
          marginTop: 20,
        }}
      >
        <Text
          style={{ fontFamily: 'PoppinsMedium', fontSize: 20, color: 'black' }}
        >
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
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: colors.black,
      }}
    >
      <View style={{ marginHorizontal: 10, marginTop: -10, marginBottom: 10 }}>
        <NavigationHeader title="Account" white />
      </View>

      <Profile name={profile?.customername} email={profile?.email} />
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
          <Text
            style={{
              color: 'white',
              fontFamily: 'PoppinsMedium',
              fontSize: 13,
            }}
          >
            Your Balance: ₦{walletBalance}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
