import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Card,
  TextInput,
  Text,
  Button,
} from 'react-native-paper';
import { useGetOrder } from '../lib/queries';

type Props = {};

export const CheckOut = ({}: Props): JSX.Element => {
  return (
    <View>
      <TextInput
        label="Apply coupon"
        right={<TextInput.Icon icon="arrow-right" size={30} color={'black'} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
