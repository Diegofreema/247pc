import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';

import { Searched, WishlistType } from '../lib/types';

const { width } = Dimensions.get('window');
export const ProductItem = (item: WishlistType & Searched): JSX.Element => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/product/${item?.id}`)}
      style={[
        styles.newArrival,
        {
          alignItems: 'center',
          justifyContent: 'center',

          marginBottom: 10,
          paddingBottom: 20,
          paddingHorizontal: 10,
          width: item.alsoLike ? width * 0.6 : width * 0.9,
        },
      ]}
      key={item.id}
    >
      <Image
        source={`https://247pharmacy.net/Uploads/${item.id}.jpg`}
        style={{ width: 250, height: 100, marginBottom: 5 }}
        contentFit="contain"
      />
      {item.Dealer && (
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 15,
            marginBottom: 5,
            textAlign: 'center',
          }}
        >
          {item?.Dealer}
        </Text>
      )}
      <Text
        style={{
          color: 'black',
          fontWeight: '400',
          fontSize: 15,
          marginBottom: 5,
          textAlign: 'center',
        }}
      >
        {item?.category}
      </Text>

      <Text
        style={{
          color: 'black',
          fontWeight: '600',
          fontSize: 17,
          marginBottom: 10,
          textAlign: 'center',
          maxWidth: width * 0.5,
        }}
      >
        {item?.product}
      </Text>
      <Text
        style={{
          color: 'black',
          fontWeight: 'bold',
          fontSize: 20,
          textAlign: 'center',
        }}
      >
        ₦{item?.sellingprice}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  newArrival: {
    height: 300,
    overflow: 'hidden',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    paddingHorizontal: 5,

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
