import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { colors } from '../constants/Colors';

export const Floating = (): JSX.Element => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/new')}
      style={({ pressed }) => [
        pressed && { opacity: 0.5 },
        {
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: colors.lightGreen,
          padding: 10,
          borderRadius: 50,
          zIndex: 1,
          height: 70,
          width: 70,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <Text
        style={{ fontSize: 13, color: 'white', fontFamily: 'PoppinsMedium' }}
      >
        New
      </Text>
    </Pressable>
  );
};
