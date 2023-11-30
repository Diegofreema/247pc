import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useStoreId } from '../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';

type Props = {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  loading: boolean;
};

const Profile = ({ isLoggedIn, email, name, loading }: Props) => {
  const router = useRouter();
  const { removeId, removeUser } = useStoreId();
  const toast = useToast();
  const logout = async () => {
    removeId();
    toast.show('Logged out successfully', {
      type: 'success',
      placement: 'bottom',
      duration: 4000,
      animationType: 'slide-in',
    });
    router.push('/');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10,
      }}
    >
      <View>
        {isLoggedIn && (
          <>
            {loading ? (
              <ActivityIndicator animating />
            ) : (
              <>
                <Text
                  style={{ fontSize: 19, fontWeight: 'bold', color: '#fff' }}
                >
                  Welcome {name}!
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: '400', color: '#fff' }}
                >
                  {email}
                </Text>
              </>
            )}
          </>
        )}
      </View>

      <Button
        onPress={logout}
        textColor="#000"
        icon={'logout'}
        style={{ backgroundColor: '#fff', borderRadius: 5 }}
      >
        Logout
      </Button>
    </View>
  );
};

export default Profile;
