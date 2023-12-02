import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React from 'react';
import Container from '../components/Container';
import NavigationHeader from '../components/NavigationHeader';
import CartItem from '../components/CartItem';
import { useCart, useGetCart, useGetOrder, useWishlist } from '../lib/queries';
import { ActivityIndicator, Button } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useRemoveFromCart } from '../lib/mutation';
import { CartType } from '../lib/types';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
type Props = {};

const cart = (props: Props) => {
  const router = useRouter();
  const {
    data: order,
    isPaused: isPausedOrder,
    isPending: loadingOrder,
    isFetching: isFetchingOrder,
    isError: isErrorOrder,
    isLoading: isLoadingOrder,
  } = useGetOrder();
  const {
    data: wishList,
    isFetching: isFetchingWishlist,
    isError: isErrorWishlist,
    isPaused: isPausedWishlist,
    isPending: isPendingWishlist,
  } = useWishlist();
  const { mutateAsync: removeFromCart, isPending: removeFromCartPending } =
    useRemoveFromCart();
  const {
    data,
    isFetching,
    isPaused,
    isError,
    isPending,
    isLoading: isLoadingCart,
  } = useGetCart();
  if (isPaused || isPausedOrder || isPausedWishlist) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }
  if (isError || isErrorOrder || isErrorWishlist) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
      </View>
    );
  }

  return (
    <Container>
      <NavigationHeader back title="Cart" />
      <View
        style={{
          marginTop: 30,
          flex: 1,

          justifyContent: 'center',
        }}
      >
        {isLoadingOrder ||
        isLoadingCart ||
        isPendingWishlist ||
        isFetchingWishlist ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color="black" animating />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                {
                  marginBottom: 10,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  fle1x: 1,
                },
              ]}
              onPress={() => router.push('/updateProfile')}
            >
              <Text
                style={{
                  color: 'skyblue',
                  fontWeight: 'bold',
                  alignSelf: 'flex-end',
                }}
              >
                Change delivery address
              </Text>
            </Pressable>
            <FlatList
              ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
              ListHeaderComponent={() =>
                data && data?.length > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                      paddingHorizontal: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {order?.items} item(s)
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                      ₦{order?.total}
                    </Text>
                  </View>
                ) : null
              }
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item, index) => item.productid + index}
              renderItem={({ item, index }) => (
                <CartItem
                  wishList={wishList}
                  index={index}
                  {...item}
                  removeFromCart={removeFromCart}
                  removeFromCartPending={removeFromCartPending}
                />
              )}
              ListFooterComponent={() => {
                return data && data?.length > 0 ? (
                  <Button
                    onPress={() => router.push('/checkout')}
                    buttonColor={colors.lightGreen}
                    textColor="#fff"
                  >
                    Checkout
                  </Button>
                ) : null;
              }}
              ListFooterComponentStyle={{
                marginBottom: 50,
              }}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                  >
                    No items in cart
                  </Text>
                  <Pressable
                    style={({ pressed }) => [
                      pressed && { opacity: 0.5 },
                      {
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      },
                    ]}
                    onPress={() => router.push('/(tabs)/')}
                  >
                    <FontAwesome name="arrow-left" size={20} color="skyblue" />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'skyblue',
                      }}
                    >
                      Continue Shopping
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </Container>
  );
};

export default cart;

const styles = StyleSheet.create({});
