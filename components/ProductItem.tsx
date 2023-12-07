import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';

import { Searched, WishlistType } from '../lib/types';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';

const { width } = Dimensions.get('window');
export const ProductItem = (item: WishlistType & Searched): JSX.Element => {
  const router = useRouter();
  const { id } = useStoreId();
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
          flex: 1,
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
