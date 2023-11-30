import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';

type Props = {
  buttonColor?: string;
  textColor?: string;
  onPress: () => void;
  disabled?: boolean;
  text: string;
  loading?: boolean;
  style?: any;
};

export const MyButton = ({
  buttonColor = 'transparent',
  textColor = '#fff',
  onPress,
  disabled = false,
  text,
  loading = false,
  style,
}: Props): JSX.Element => {
  return (
    <Button
      style={[{ borderRadius: 5 }, style]}
      mode="contained"
      textColor={textColor}
      buttonColor={buttonColor}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
    >
      {text}
    </Button>
  );
};

const styles = StyleSheet.create({});
