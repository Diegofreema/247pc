import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';

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
    marginHorizontal: 20,
  },
});
