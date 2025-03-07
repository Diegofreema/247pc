import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';

import { Searched, WishlistType } from '../lib/types';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import { api } from '../lib/contants';

type Prop = {
  scroll?: () => void;
};
export const ProductItem = (
  item: WishlistType & Searched & Prop
): JSX.Element => {
  const router = useRouter();
  const { id } = useStoreId();

  const { scroll } = item;
  const handlePress = () => {
    axios
      .post(`${api}=addtoviewed&productid=${item?.id}&myuserid=${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    router.push(`/product/${item?.id}`);
    if (scroll) {
      scroll();
    }
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
        placeholder={require('../assets/images/place.jpg')}
        placeholderContentFit="contain"
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

          fontSize: 15,
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
