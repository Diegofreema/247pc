import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { Platform } from 'react-native';
import { Link } from 'expo-router';

type Props = {};

const AuthHeader = (props: Props) => {
  const openDialScreen = () => {
    let number = '';
    if (Platform.OS === 'ios') {
      number = 'telprompt:${08052255000}';
    } else {
      number = 'tel:${08052255000}';
    }
    Linking.openURL(number);
  };
  return (
    <View style={styles.container}>
      <Link href={'/(auth)/(join)/sell'} asChild>
        <Text
          style={{
            fontFamily: 'PoppinsMedium',
            fontSize: 10,
            color: '#000',
            textDecorationStyle: 'solid',
            textDecorationLine: 'underline',
          }}
        >
          Join 247pharmacy
        </Text>
      </Link>
      <Pressable style={styles.subContainer} onPress={openDialScreen}>
        <FontAwesome name="phone" size={15} color="#000" />
        <Text
          style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#000' }}
        >
          Call Us: 08052255000
        </Text>
      </Pressable>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    height: 70,
    paddingHorizontal: 20,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
});
