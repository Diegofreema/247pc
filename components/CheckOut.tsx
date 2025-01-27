import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

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
