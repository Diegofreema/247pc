import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';

import { Searched, WishlistType } from '../lib/types';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import CounterCartButton from './CounterCartButton';
import { useProduct, useWishlist } from '../lib/queries';
import { useAddToCart, useAddToWishlist } from '../lib/mutation';
import { useState } from 'react';
import { AddToCartButton } from './AddToCartButton';

const { width } = Dimensions.get('window');
export const ProductItem = (item: WishlistType & Searched): JSX.Element => {
  const router = useRouter();
  const { id } = useStoreId();

  const { mutateAsync: mutateCart, isPending: isMutatingCart } = useAddToCart();

  const [qty, setQty] = useState(1);
  const {
    data,
    isFetching,
    isPending,
    error,
    isPaused: isProductPaused,
    refetch,
  } = useProduct(item?.id);
  console.log('🚀 ~ ProductItem ~ data:', data);

  const handlePress = () => {
    axios
      .post(
        `https://247api.netpro.software/api.aspx?api=addtoviewed&productid=${item?.id}&myuserid=${id}`
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    router.push(`/product/${item?.id}`);
  };
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.newArrival,
        {
          alignItems: 'center',
          justifyContent: 'center',

          marginBottom: 10,
          paddingBottom: 20,
          paddingHorizontal: 10,
        },
      ]}
      key={item.id}
    >
      <Image
        source={`https://247pharmacy.net/Uploads/${item.id}.jpg`}
        style={{ width: 250, height: 150, marginBottom: 5 }}
        contentFit="contain"
      />
      {item.Dealer && (
        <Text
          style={{
            color: 'black',
            fontFamily: 'PoppinsBold',
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
          fontFamily: 'Poppins',
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
          fontFamily: 'PoppinsMedium',
          fontSize: 17,
          marginBottom: 10,
          textAlign: 'center',
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
          fontFamily: 'PoppinsBold',
        }}
      >
        ₦{item?.sellingprice}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  newArrival: {
    backgroundColor: '#fff',
    height: 350,

    marginBottom: 18,
    borderRadius: 5,

    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
});
