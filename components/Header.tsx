import { View } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Text } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useWalletBalance } from '../lib/queries';
import { LoggedUserType } from '../lib/types';
import { useStoreId } from '../lib/zustand/auth';
import { MyButton } from './MyButton';
import NavigationHeader from './NavigationHeader';
import Profile from './Profile';

type Props = {
  user?: LoggedUserType;
  loading?: boolean;
};

const Header = ({ user }: Props) => {
  const { user: profile } = useStoreId();

  const {
    data: walletBalance,

    isPaused,
    isPending: walletBalanceIsPending,
    isError: walletBalanceIsError,
  } = useWalletBalance();

  const loading = walletBalanceIsPending;

  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
  };
  if (isPaused) {
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
  if (walletBalanceIsError) {
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
