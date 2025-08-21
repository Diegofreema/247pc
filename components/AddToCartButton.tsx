import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useAddToCart } from '../lib/mutation';
import { MyButton } from './MyButton';

type Props = {
  productId: string;
  count?: string;
};

export const AddToCartButton = ({ productId, count }: Props) => {
  const { mutateAsync: mutateCart, isPending: isMutatingCart } = useAddToCart();
  const [qty, setQty] = useState(1);
  const onIncrease = () => {
    if (count && qty < +count) {
      setQty((prevQty) => prevQty + 1);
    }
  };
  const onDecrease = () => {
    if (qty > 1) {
      setQty((prevQty) => prevQty - 1);
    }
  };

  return (
    <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
      <View
        style={
          {
            //   flexDirection: pathname === '/cart' ? 'column' : 'row',
            //   gap: 15,
            //   flex: 1,
            //   alignItems: pathname === '/cart' ? 'flex-start' : 'center',
          }
        }
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: 'black',
            borderWidth: StyleSheet.hairlineWidth,
            justifyContent: 'center',
          }}
        >
          <Button onPress={onDecrease} disabled={qty === 1}>
            <FontAwesome name="minus" size={15} color="#000" />
          </Button>
          <Text>{qty}</Text>
          <Button onPress={onIncrease}>
            <FontAwesome name="plus" size={15} color="#000" />
          </Button>
        </View>
      </View>
      <MyButton
        buttonColor={colors.lightGreen}
        textColor="white"
        text="Add to cart"
        onPress={() => mutateCart({ productId: productId, qty: qty })}
        loading={isMutatingCart}
      />
    </View>
  );
};
