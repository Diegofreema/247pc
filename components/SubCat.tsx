import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { colors } from '../constants/Colors';
import { SubProps } from '../lib/types';
type Props = {
  chief?: boolean;
  index: number;
  img?: string;
};
export const SubCat = ({ category, chief, index, img }: SubProps & Props) => {
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
          width: width * 0.4,

          marginRight: index % 2 !== 0 ? 0 : 10,

          height: 200,
          backgroundColor: 'white',
          padding: 5,
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
          placeholderContentFit="cover"
          placeholder={require('../assets/images/place.jpg')}
          contentFit="cover"
        />
      )}

      {chief && (
        <Text
          style={{
            fontFamily: 'PoppinsBold',
            color: chief ? colors.lightGreen : 'black',
            fontSize: chief ? 15 : 11,
            textAlign: 'center',
            marginTop: chief ? 0 : 4,
            paddingHorizontal: 5,
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
