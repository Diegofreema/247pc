import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { colors } from '../constants/Colors';
import { CartType, WishlistType } from '../lib/types';
import { useAddToWishlist } from '../lib/mutation';

type Props = {
  removeFromCart: ({ salesId }: { salesId: string }) => void;
  removeFromCartPending: boolean;
  index: number;
  wishlist: WishlistType[];
  reloadData: () => void;
};

const CartItem = ({
  product,
  productid,
  qty,
  saleid,
  seller,
  unitprice,
  removeFromCart,
  removeFromCartPending,
  index,
  wishlist,
  reloadData,
}: Props & CartType) => {
  const { mutateAsync, isPending } = useAddToWishlist();

  const [wished, setWished] = useState(false);
  const [clickedIndex, setClickedIndex] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  useEffect(() => {
    const inWishlist = wishlist?.find(
      (item: WishlistType) => item?.id === productid
    );
    if (inWishlist?.id === productid) {
      setWished(true);
    } else {
      setWished(false);
    }
  }, [wishlist, productid]);
  console.log(selectedIndex, clickedIndex);
  const handleRemoveFromCart = (saleid: string) => {
    setSelectedIndex(saleid);
    removeFromCart({ salesId: saleid });
    reloadData();
  };
  return (
    <View style={styles.containerStyle}>
      <View
        style={{
          justifyContent: 'space-between',
          gap: 30,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Image
          source={`https://247pharmacy.net/Uploads/${productid}.jpg`}
          style={{
            width: 100,
            height: 100,
          }}
          contentFit="contain"
          placeholderContentFit="cover"
          placeholder={require('../assets/images/place.jpg')}
        />
        <View style={{ gap: 5, flex: 1 }}>
          <Text
            variant="titleMedium"
            style={{
              fontFamily: 'PoppinsMedium',
              fontSize: 12,
              color: '#000',
            }}
          >
            {product}
          </Text>
          <Text
            variant="titleSmall"
            style={{ fontFamily: 'Poppins', fontSize: 10, color: '#000' }}
          >
            Sold by {seller}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginHorizontal: 20,
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 14, fontFamily: 'Poppins', color: '#000' }}>
          Quantity: {qty}
        </Text>
        <Text
          variant="titleLarge"
          style={{
            fontSize: 14,
            fontFamily: 'Poppins',
            color: '#000',
          }}
        >
          ₦{unitprice}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          gap: 10,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        {!wished && (
          <Button
            loading={isPending && productid === clickedIndex}
            onPress={() => {
              setClickedIndex(productid);
              mutateAsync(productid);
            }}
            icon={'heart'}
            buttonColor={colors.lightGreen}
            textColor="white"
            rippleColor={colors.lightGreen}
            mode="outlined"
            style={{
              width: '90%',
            }}
            labelStyle={{ fontSize: 12, fontFamily: 'Poppins' }}
            contentStyle={{ paddingVertical: 6 }}
          >
            Save to wishlist
          </Button>
        )}
        <Button
          onPress={() => handleRemoveFromCart(saleid)}
          loading={removeFromCartPending && saleid === selectedIndex}
          icon="delete"
          buttonColor={colors.danger}
          textColor={'white'}
          mode="outlined"
          rippleColor={colors.danger}
          style={{
            width: '90%',
          }}
          labelStyle={{ fontSize: 12, fontFamily: 'Poppins' }}
          contentStyle={{ paddingVertical: 6 }}
        >
          Remove from cart
        </Button>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  containerStyle: {
    minHeight: 200,

    justifyContent: 'center',
    marginBottom: 20,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 25,
    paddingHorizontal: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  buttonStyle: {
    backgroundColor: colors.lightGreen,
  },
});
