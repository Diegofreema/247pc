import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SubProps } from '../lib/types';
import { useRouter } from 'expo-router';
type Props = {
  chief?: boolean;
  index: number;
};
export const SubCat = ({
  category,
  chief,
  index,
}: SubProps & Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const navigate = () => {
    if (chief) {
      router.push(`/chief/${category}`);
    } else {
      router.push(`/category/${category}`);
    }
  };
  return (
    <Pressable
      onPress={navigate}
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
        {
          width: chief ? width * 0.42 : width * 0.45,
          aspectRatio: 1,
          marginRight: index % 2 !== 0 ? 0 : 10,
          position: 'relative',
        },
        styles.container,
      ]}
    >
      <Text
        style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: 20,
          textAlign: 'center',
        }}
      >
        {category}
      </Text>
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
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    overflow: 'hidden',
    padding: 10,

    borderRadius: 30,
  },
});
