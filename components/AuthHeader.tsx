import {FontAwesome} from '@expo/vector-icons';
import React from 'react';
import {Linking, Platform, Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Link} from 'expo-router';


const phoneNumber = 2349011770294
const url = `https://wa.me/${phoneNumber}?text=Hello%20dear!`;
export const onOpenWhatsapp = async () => {
        await Linking.openURL(url);

}
const AuthHeader = () => {

  const openDialScreen = async () => {
    let number;
    if (Platform.OS === 'ios') {
      number = `telprompt:+2439011770294`;
    } else {
      number = 'tel:+2439011770294';
    }
   await Linking.openURL(number);
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
          <FontAwesome name="phone" size={15} color="#000" style={{marginRight: 5}} />

        <Text
          style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#000' }}
        >
          Call Us: 09011770294
        </Text>
      </Pressable>
        <Pressable style={styles.subContainer} onPress={onOpenWhatsapp}>
        <Text
          style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#000' }}
        >
          Chat us
        </Text>
            <FontAwesome name="whatsapp" style={{marginLeft: 5}} size={15} color="#000" />
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
