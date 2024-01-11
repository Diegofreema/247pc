import { StyleSheet, View, Text } from 'react-native';
import { Order } from '../lib/types';

export const OrderCard = ({ price }: Order): JSX.Element => {
  return (
    <View>
      <Text>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
