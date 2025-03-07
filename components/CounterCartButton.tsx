import { FontAwesome } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { colors } from '../constants/Colors';

type Props = {
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
  addToWishlist?: () => void;
  onAddToCart?: () => void;
  loading?: boolean;
  inWishlist?: boolean;
  addingToCart?: boolean;
};

const CounterCartButton = ({
  onDecrease,
  onIncrease,
  qty,
  addToWishlist,
  onAddToCart,
  loading,
  inWishlist,
  addingToCart,
}: Props) => {
  const pathname = usePathname();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 15,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: pathname === '/cart' ? 'column' : 'row',
            gap: 15,
            flex: 1,
            alignItems: pathname === '/cart' ? 'flex-start' : 'center',
          }}
        >
          <Text style={{ fontFamily: 'Poppins', fontSize: 12 }}>Quantity:</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: 'black',
              borderWidth: StyleSheet.hairlineWidth,
              justifyContent: 'center',
            }}
          >
            <Button
              contentStyle={{ padding: 5 }}
              onPress={onDecrease}
              disabled={qty === 1}
            >
              <FontAwesome name="minus" size={15} color="#000" />
            </Button>
            <Text>{qty}</Text>
            <Button contentStyle={{ padding: 5 }} onPress={onIncrease}>
              <FontAwesome name="plus" size={15} color="#000" />
            </Button>
          </View>
        </View>

        {pathname !== '/cart' &&
          (loading ? (
            <ActivityIndicator animating />
          ) : (
            <FontAwesome
              name="heart"
              size={25}
              color={inWishlist ? 'crimson' : 'gray'}
              onPress={addToWishlist}
            />
          ))}
      </View>
      {pathname !== '/cart' && (
        <Button
          loading={addingToCart}
          mode="contained"
          style={{ marginTop: 20 }}
          rippleColor={colors.ripple}
          buttonColor={colors.lightGreen}
          textColor={'white'}
          onPress={onAddToCart}
          labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
        >
          Add to cart
        </Button>
      )}
    </View>
  );
};

export default CounterCartButton;
