import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  children: PropsWithChildren<string>;
};

export const NormalText = ({ children }: Props): JSX.Element => {
  return (
    <Text
      style={{ fontSize: 13, color: '#000', marginBottom: 10, lineHeight: 18 }}
    >
      {children}
    </Text>
  );
};

export const BoldText = ({ children }: Props): JSX.Element => {
  return (
    <Text
      style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
      }}
    >
      {children}
    </Text>
  );
};
type TitleType = {
  heading: string;
  text: string;
};
export const TitleText = ({ heading, text }: TitleType): JSX.Element => {
  return (
    <Text
      style={{ color: 'black', fontSize: 13, marginBottom: 10, lineHeight: 18 }}
    >
      <Text style={{ fontWeight: 'bold', color: 'black' }}>{heading}</Text>
      {text}
    </Text>
  );
};

type NumberedTextProps = {
  number: string;
  text: string;
  bold?: boolean;
  heading?: string;
};

export const NumberedTextBold = ({
  number,
  text,
  bold,
}: NumberedTextProps): JSX.Element => {
  return (
    <View
      style={{
        flexDirection: 'row',

        gap: 15,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: '#000',

          fontWeight: 'bold',
        }}
      >
        {number}
      </Text>
      <Text
        style={{
          fontSize: bold ? 16 : 13,
          color: '#000',
          lineHeight: 18,
          fontWeight: bold ? 'bold' : 'normal',
        }}
      >
        {text}
      </Text>
    </View>
  );
};
export const NumberedText = ({
  number,
  text,
  bold,
  heading,
}: NumberedTextProps): JSX.Element => {
  return (
    <View
      style={{
        flexDirection: 'row',

        gap: 15,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: '#000',

          fontWeight: 'bold',
        }}
      >
        {number}
      </Text>
      <Text
        style={{
          fontSize: bold ? 16 : 13,
          color: '#000',
          lineHeight: 18,
          fontWeight: bold ? 'bold' : 'normal',
        }}
      >
        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>
          {heading}
        </Text>{' '}
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
