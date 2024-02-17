import { StyleSheet, View, Text } from 'react-native';

import { useState } from 'react';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { MyButton } from './MyButton';
import { colors } from '../constants/Colors';

type Props = {
  refetch: () => void;
};

export const ErrorComponent = ({ refetch }: Props): JSX.Element => {
  const [retry, setRetry] = useState(false);

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

const styles = StyleSheet.create({});
