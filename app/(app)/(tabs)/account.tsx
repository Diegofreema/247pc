import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useStoreId } from '../../../lib/zustand/auth';
import axios from 'axios';
import { LoggedUserType } from '../../../lib/types';
import Container from '../../../components/Container';
import { Entypo, Foundation, MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useWalletBalance } from '../../../lib/queries';
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
    icon: <MaterialIcons name="inventory" size={30} color="black" />,
  },
];
const Account = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const { user, id } = useStoreId();

  const router = useRouter();

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
        </ScrollView>
      </Container>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({});
