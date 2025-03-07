import React from 'react';
import { Text } from 'react-native';

import { TextInput } from 'react-native-paper';

type Props = {
  label?: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'email-address' | 'numeric' | 'default';
  secureTextEntry?: boolean;
  value: string;
  multiline?: boolean;
  numberOfLines?: number;
  toggleSecureEntry?: () => void;
  password?: boolean;
};

const InputComponent = ({
  label,
  placeholder,
  onChangeText,
  keyboardType,
  secureTextEntry = false,
  value,
  multiline,
  numberOfLines,
  toggleSecureEntry,
  password,
}: Props) => {
  return (
    <>
      <Text
        style={{ color: 'black', fontFamily: 'PoppinsMedium', fontSize: 15 }}
      >
        {label}
      </Text>

      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        mode="outlined"
        keyboardType={keyboardType}
        value={value}
        secureTextEntry={secureTextEntry}
        style={{ backgroundColor: 'transparent', color: 'black', flex: 1 }}
        contentStyle={{
          backgroundColor: 'transparent',
          color: 'black',
          fontFamily: 'Poppins',
          fontSize: 13,
        }}
        placeholderTextColor={'black'}
        textColor="black"
        activeOutlineColor="black"
        outlineStyle={{ borderColor: 'black', borderWidth: 1 }}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        right={
          password ? (
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              color={'black'}
              onPress={toggleSecureEntry}
            />
          ) : null
        }
      />
    </>
  );
};

export default InputComponent;
