import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import { MyButton } from '../../components/MyButton';
import { colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

type Props = {};
const { width } = Dimensions.get('window');
const join = (props: Props) => {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Container>
        <NavigationHeader back title="Join 247pharmacy" />
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: width * 0.6, height: 150 }}
            contentFit="contain"
          />
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
              Join 247pharmacy
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20, gap: 10 }}>
          <MyButton
            icon={'cart'}
            onPress={() => router.push('/sell')}
            text="Sell on 247pharmacy"
            textColor="white"
            buttonColor={colors.lightGreen}
          />
          <MyButton
            icon={'doctor'}
            onPress={() => router.push('/practitioner')}
            text="Practitioners Sign Up"
            textColor="white"
            buttonColor={colors.lightGreen}
          />
        </View>
      </Container>
    </View>
  );
};

export default join;

const styles = StyleSheet.create({});
