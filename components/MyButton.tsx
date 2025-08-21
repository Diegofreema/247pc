import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

type Props = {
  buttonColor?: string;
  textColor?: string;
  onPress: () => void;
  icon?: IconSource;
  text: string;
  loading?: boolean;
  style?: any;
  disabled?: boolean;
};

export const MyButton = ({
  buttonColor = 'transparent',
  textColor = '#fff',
  onPress,
  loading = false,
  text,
  disabled,
  style,
  icon,
}: Props) => {
  return (
    <Button
      style={[{ borderRadius: 5 }, style]}
      mode="contained"
      textColor={textColor}
      buttonColor={buttonColor}
      onPress={onPress}
      loading={loading}
      icon={icon}
      disabled={disabled}
      labelStyle={{ fontSize: 12, fontFamily: 'PoppinsMedium' }}
      contentStyle={{ paddingVertical: 6 }}
    >
      {text}
    </Button>
  );
};
