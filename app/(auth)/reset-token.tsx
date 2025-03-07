import React from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useToken } from '../../lib/zustand/useToken';
import AuthHeader from '../../components/AuthHeader';
import { Image } from 'expo-image';

const ResetToken = () => {
  const token = useToken((state) => state.details.token);
  const removeToken = useToken((state) => state.removeToken);
  const setToken = useToken((state) => state.setToken);
  const { width } = useWindowDimensions();
  console.log(token);

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader />

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: width * 0.6, height: 100 }}
            contentFit="cover"
          />
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, fontFamily: 'PoppinsBold' }}>
              Enter token
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetToken;
