import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import CartItem from '../../components/CartItem';
import Container from '../../components/Container';
import { FloatingNav } from '../../components/FloatingNav';
import { MyButton } from '../../components/MyButton';
import NavigationHeader from '../../components/NavigationHeader';
import { colors } from '../../constants/Colors';
import { useRemoveFromCart } from '../../lib/mutation';
import {
  useFee,
  useGetCart,
  useGetOrder,
  useUser,
  useWishlist,
} from '../../lib/queries';
import { useStoreId } from '../../lib/zustand/auth';

const CartScreen = () => {
  const { id } = useStoreId();
  const { data: user } = useUser(id);
  const {
    isPending: feeIsPending,
    isPaused: feeIsPaused,
    isError: feeIsError,
  } = useFee(id, user?.productInCart!, user?.communityId!);
  const router = useRouter();
  const [reload, setReload] = useState(false);

  const [toggleReload, setToggleReload] = useState(false);

  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };

  const reloadData = async () => {
    setToggleReload(!toggleReload);
  };

  const {
    data: order,
    isPaused: isPausedOrder,

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
    isPaused,
    isError,
    isPending,
    isLoading: isLoadingCart,
    refetch,
  } = useGetCart();
  if (feeIsPaused || isPaused || isPausedOrder || isPausedWishlist) {
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
  if (feeIsError || isError || isErrorOrder || isErrorWishlist) {
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
          marginTop: 20,
          flex: 1,

          justifyContent: 'center',
        }}
      >
        {feeIsPending ||
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
                  padding: 5,
                },
              ]}
              onPress={() => router.push('/updateProfile')}
            >
              <Text
                style={{
                  color: colors.lightGreen,
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
              onRefresh={refetch}
              refreshing={isPending}
              data={data}
              keyExtractor={(item, index) => item.productid + index}
              renderItem={({ item, index }) => {
                return (
                  <CartItem
                    wishList={wishList}
                    index={index + Math.random() * 400}
                    {...item}
                    removeFromCart={removeFromCart}
                    removeFromCartPending={removeFromCartPending}
                    reloadData={reloadData}
                  />
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
                      fontSize: 15,
                      fontFamily: 'PoppinsMedium',
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
                        fontSize: 15,
                        fontFamily: 'PoppinsMedium',
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

export default CartScreen;
