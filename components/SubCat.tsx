import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SubProps } from '../lib/types';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
type Props = {
  chief?: boolean;
  index: number;
  img?: string;
};
export const SubCat = ({
  category,
  chief,
  index,
  img,
}: SubProps & Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  // const Image = require(`${img}`);
  const navigate = () => {
    if (chief) {
      router.push(`/chief/${category}`);
    }
  };

  return (
    <Pressable
      onPress={navigate}
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
        {
          width: chief ? width * 0.45 : width * 0.45,

          marginRight: index % 2 !== 0 ? 0 : 10,

          height: 200,
          backgroundColor: chief ? 'gray' : 'white',
        },
        styles.container,
      ]}
    >
      {chief ? null : (
        <Image
          style={{
            width: '100%',
            height: '80%',
            borderRadius: 6,
          }}
          source={{ uri: img }}
          contentFit="cover"
        />
      )}

      {chief && (
        <Text
          style={{
            fontWeight: 'bold',
            color: chief ? 'white' : 'black',
            fontSize: chief ? 20 : 17,
            textAlign: 'center',
            marginTop: chief ? 0 : 4,
          }}
        >
          {category}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    paddingHorizontal: 5,
  },
});
