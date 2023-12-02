import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { trimTitle } from '../lib/helpers';
import CounterCartButton from './CounterCartButton';
import { colors } from '../constants/Colors';
import { CartType, WishlistType } from '../lib/types';
import { useAddToWishlist } from '../lib/mutation';
import { useGetOrder, useWishlist } from '../lib/queries';

type Props = {
  removeFromCart: ({ salesId }: { salesId: string }) => void;
  removeFromCartPending: boolean;
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
}: Props & CartType) => {
  const { mutateAsync, isPending } = useAddToWishlist();
  const {
    data: wishList,
    isFetching: isFetchingWishlist,
    isError,
    isPaused,
    isPending: isPendingWishlist,
  } = useWishlist();

  const [wished, setWished] = useState(false);
  useEffect(() => {
    const inWishlist = wishList?.find(
      (item: WishlistType) => item?.id === productid
    );
    if (inWishlist?.id === productid) {
      setWished(true);
    } else {
      setWished(false);
    }
  }, [wishList, productid]);
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
        />
        <View style={{ gap: 5 }}>
          <Text
            variant="titleMedium"
            style={{ fontWeight: 'bold', color: '#000' }}
          >
            {product}
          </Text>
          <Text
            variant="titleSmall"
            style={{ fontWeight: '400', color: '#000' }}
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
        <Text style={{ fontWeight: 'bold', color: '#000' }}>
          Quantity: {qty}
        </Text>
        <Text
          variant="titleLarge"
          style={{
            fontWeight: 'bold',
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
            loading={isPending}
            onPress={() => mutateAsync(productid)}
            icon={'heart'}
            buttonColor={colors.lightGreen}
            textColor="white"
            rippleColor={colors.lightGreen}
            mode="outlined"
            style={{
              width: '90%',
            }}
          >
            Save to wishlist
          </Button>
        )}
        <Button
          onPress={() => removeFromCart({ salesId: saleid })}
          loading={removeFromCartPending}
          icon="delete"
          buttonColor={colors.danger}
          textColor={removeFromCartPending ? 'black' : 'white'}
          mode="outlined"
          rippleColor={colors.danger}
          style={{
            width: '90%',
          }}
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
