import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../constants/Colors';

type Props = {};

const AuthHeader = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>
        Join 247pharmacy
      </Text>
      <View style={styles.subContainer}>
        <FontAwesome name="phone" size={15} color="#000" />
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>
          Call Us: 08052255000
        </Text>
      </View>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray,
    height: 70,
    paddingHorizontal: 20,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
