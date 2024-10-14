import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const Container = ({ children, style }: Props) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
});
