import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useStoreId } from '../lib/zustand/auth';
import { useUser } from '../lib/queries';

type Props = {};

export const TopHeader = ({}: Props): JSX.Element => {
  const { id } = useStoreId();

  const { data: user, isLoading, isFetching, isPending } = useUser(id);
  const loading = isLoading || isFetching || isPending;
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 10,
      }}
    >
      <Pressable
        style={{
          flex: 1,
          paddingHorizontal: 10,
          height: 50,
          borderColor: '#000',
        }}
        onPress={() => router.push('/search')}
      >
        <Searchbar
          style={{
            backgroundColor: 'transparent',
            color: 'black',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 8,
          }}
          editable={false}
          value=""
          icon={() => <FontAwesome name="search" size={20} />}
        />
      </Pressable>

      <Pressable onPress={() => router.push('/cart')}>
        <FontAwesome name="shopping-cart" size={25} color={'#000'} />
        {user && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'green',
              borderRadius: 10,
              width: 20,
              top: -10,
              right: -6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? (
              <Text>0</Text>
            ) : (
              <Text style={{ color: '#fff' }}>{user?.productInCart}</Text>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});
