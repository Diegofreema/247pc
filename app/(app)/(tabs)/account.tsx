import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useStoreId } from '../../../lib/zustand/auth';
import axios from 'axios';
import { LoggedUserType } from '../../../lib/types';
import Container from '../../../components/Container';
import {
  AntDesign,
  Entypo,
  Foundation,
  MaterialIcons,
} from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useWalletBalance } from '../../../lib/queries';
import { DeleteModal } from '../../../components/DeleteModal';
type Props = {};

const pages = [
  {
    name: 'Update Profile',
    link: '/updateProfile',
    icon: <Entypo name="user" size={30} color="black" />,
  },
  {
    name: 'Update Password',
    link: '/updatePassword',
    icon: <Entypo name="lock" size={30} color="black" />,
  },
  {
    name: 'Wallet',
    link: '/wallet',
    icon: <Entypo name="wallet" size={30} color="black" />,
  },
  {
    name: 'Order',
    link: '/order',
    icon: <AntDesign name="book" size={30} color="black" />,
  },
];

const Account = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<LoggedUserType>();
  const { id } = useStoreId();

  const queryClient = useQueryClient();
  useEffect(() => {
    const getProfile = async () => {
      const { data } = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=userinfo&myuserid=${id}`
      );

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
  const onClose = () => {
    setVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header user={user} />

      <Container>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: 20, marginTop: 20 }}
        >
          {pages.map((page, index) => (
            <Pressable
              onPress={() => router.push(page.link as any)}
              key={index}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  gap: 20,
                  alignItems: 'center',
                }}
              >
                {page.icon}
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 15 }}>
                  {page.name}
                </Text>
              </View>
              <Entypo name="chevron-right" size={24} color="black" />
            </Pressable>
          ))}
          <Pressable
            onPress={() => setVisible(true)}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              { flexDirection: 'row', gap: 20, padding: 5 },
            ]}
          >
            <Entypo name="trash" size={24} color="black" />
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 15 }}>
              Delete Profile
            </Text>
          </Pressable>
          <DeleteModal visible={visible} onClose={onClose} />
        </ScrollView>
      </Container>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({});
