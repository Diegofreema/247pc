import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import CartItem from '../../components/CartItem';
import {
  useCart,
  useGetCart,
  useGetOrder,
  useWishlist,
} from '../../lib/queries';
import { ActivityIndicator, Button } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useRemoveFromCart } from '../../lib/mutation';
import { CartType } from '../../lib/types';
import { useFocusEffect, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { MyButton } from '../../components/MyButton';
import { FloatingNav } from '../../components/FloatingNav';
import axios from 'axios';
import { useStoreId } from '../../lib/zustand/auth';
type Props = {};
const api = process.env.EXPO_PUBLIC_API_URL;

const cart = (props: Props) => {
  const router = useRouter();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, id } = useStoreId();
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const loadData = async () => {
        try {
          const res = await axios.post(
            `${api}?api=cartpageload&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}`
          );
          console.log(res.data);
          console.log('reloading');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [])
  );

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
    refetch,
  } = useGetCart();
  if (isPaused || isPausedOrder || isPausedWishlist) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }
  if (isError || isErrorOrder || isErrorWishlist) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
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
        {loading ||
        isLoadingOrder ||
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
                  fontFamily: 'PoppinsMedium',
                  fontSize: 12,
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
                    <Text style={{ fontFamily: 'PoppinsBold', fontSize: 12 }}>
                      {order?.items} item(s)
                    </Text>
                    <Text style={{ fontFamily: 'PoppinsBold', fontSize: 12 }}>
                      ₦{order?.total}
                    </Text>
                  </View>
                ) : null
              }
              contentContainerStyle={{ paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item, index) => item.productid + index}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <CartItem
                      wishList={wishList}
                      index={index + Math.random() * 400}
                      {...item}
                      removeFromCart={removeFromCart}
                      removeFromCartPending={removeFromCartPending}
                    />
                  </>
                );
              }}
              ListFooterComponent={() => {
                return data && data?.length > 0 ? (
                  <Button
                    onPress={() => router.push('/checkout')}
                    buttonColor={colors.lightGreen}
                    textColor="#fff"
                    labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
                  >
                    Checkout
                  </Button>
                ) : null;
              }}
              ListFooterComponentStyle={{
                marginBottom: 50,
              }}
              ListEmptyComponent={
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
                    onPress={() => router.push('/(app)/(tabs)/')}
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
              }
            />
          </View>
        )}
      </View>
      <FloatingNav />
    </Container>
  );
};

export default cart;

const styles = StyleSheet.create({});
