import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import { useStoreId } from '../lib/zustand/auth';
import { useUser } from '../lib/queries';

type Props = {};
const Max_Header_Height = 70;
const Min_Header_Height = 0;
const Scroll_Distance = Max_Header_Height - Min_Header_Height;
export const TopHeader = ({}: Props): JSX.Element => {
  const { id } = useStoreId();

  const { data: user, isLoading, isFetching, isPending } = useUser(id);
  const loading = isPending;
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}
    >
      <Pressable
        style={({ pressed }) => [
          pressed && { opacity: 0.5 },
          {
            paddingHorizontal: 10,
            height: 55,
            borderColor: '#000',
            backgroundColor: 'transparent',
            borderWidth: 1,
            width: '90%',
            borderRadius: 10,
            justifyContent: 'center',
          },
        ]}
        onPress={() => router.push('/search')}
      >
        <FontAwesome name="search" size={25} />
      </Pressable>

      <Pressable onPress={() => router.push('/cart')}>
        <FontAwesome name="shopping-cart" size={25} color={'#000'} />
        {user ? (
          <View style={styles.absolute}>
            {loading ? (
              <Text
                style={{ color: '#fff', fontSize: 10, fontFamily: 'Poppins' }}
              >
                0
              </Text>
            ) : (
              <Text
                style={{ color: '#fff', fontSize: 10, fontFamily: 'Poppins' }}
              >
                {user?.productInCart}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.absolute}>
            <Text
              style={{ color: '#fff', fontSize: 10, fontFamily: 'Poppins' }}
            >
              0
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    backgroundColor: 'green',
    borderRadius: 10,
    width: 20,
    height: 20,
    top: -10,
    right: -6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
