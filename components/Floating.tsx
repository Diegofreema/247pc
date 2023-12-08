import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

type Props = {};

export const Floating = ({}: Props): JSX.Element => {
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
      <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
        New
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
