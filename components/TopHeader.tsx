import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { Searchbar, Button, ActivityIndicator } from 'react-native-paper';
import { useStoreId } from '../lib/zustand/auth';
import { useUser } from '../lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LoggedUserType } from '../lib/types';

const api = process.env.EXPO_PUBLIC_API_URL;
type Props = {};
const Max_Header_Height = 70;
const Min_Header_Height = 0;
const Scroll_Distance = Max_Header_Height - Min_Header_Height;
export const TopHeader = ({}: Props): JSX.Element => {
  const [user, setUser] = useState<LoggedUserType>();
  const { id } = useStoreId();

  const queryClient = useQueryClient();
  useEffect(() => {
    const getProfile = async () => {
      const { data } = await axios.get(`${api}?api=userinfo&myuserid=${id}`);

      return data;
    };
    const getUser = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
      });
      setUser(data);
    };

    getUser();
  }, []);
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}
    >
      <Pressable
        style={({ pressed }) => [
          pressed && { opacity: 0.5 },
          {
            paddingHorizontal: 10,
            height: 55,
            borderColor: '#000',
            backgroundColor: 'transparent',
            borderWidth: 1,
            width: '90%',
            borderRadius: 10,
            justifyContent: 'center',
          },
        ]}
        onPress={() => router.push('/search')}
      >
        <FontAwesome name="search" size={25} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [pressed && { opacity: 0.5 }, { padding: 5 }]}
        onPress={() => router.push('/cart')}
      >
        <FontAwesome name="shopping-cart" size={25} color={'#000'} />
        {!user?.productInCart && (
          <View style={styles.absolute}>
            <Text style={styles.absoluteText}>0</Text>
          </View>
        )}

        {user?.productInCart && (
          <View style={styles.absolute}>
            <Text style={styles.absoluteText}> {user?.productInCart}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    backgroundColor: 'green',
    borderRadius: 10,
    width: 20,
    height: 20,
    top: -5,
    right: -6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteText: { color: '#fff', fontSize: 10, fontFamily: 'Poppins' },
});
