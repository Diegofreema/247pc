import { Text, View } from 'react-native';

import { useState } from 'react';

import { colors } from '../constants/Colors';
import { MyButton } from './MyButton';

type Props = {
  refetch: () => void;
};

export const ErrorComponent = ({ refetch }: Props) => {
  const [, setRetry] = useState(false);

  const handleRetry = () => {
    refetch();
    setRetry((prev) => !prev);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '100%',
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          width: '100%',
        }}
      >
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontFamily: 'PoppinsBold',
            marginBottom: 20,
          }}
        >
          Something went wrong
        </Text>
        <View style={{ backgroundColor: 'white', width: '60%' }}>
          <MyButton
            text="Retry"
            textColor="white"
            buttonColor={colors.lightGreen}
            onPress={handleRetry}
          />
        </View>
      </View>
    </View>
  );
};
