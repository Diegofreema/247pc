import { StyleSheet, View, useWindowDimensions, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct, useProductCat, useWishlist } from '../../lib/queries';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import { Button, Card, Text } from 'react-native-paper';
import RenderHtml, { HTMLSource } from 'react-native-render-html';
import { ActivityIndicator } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import CounterCartButton from '../../components/CounterCartButton';
import { useQueryClient } from '@tanstack/react-query';
import { useAddToCart, useAddToWishlist } from '../../lib/mutation';
import { useStoreId } from '../../lib/zustand/auth';
import { WishlistType } from '../../lib/types';
import { Image } from 'expo-image';
import { colors } from '../../constants/Colors';
import { ProductItem } from '../../components/ProductItem';
import { MyButton } from '../../components/MyButton';
import { FloatingNav } from '../../components/FloatingNav';
type Props = {};

const ProductDetail = (props: Props) => {
  const { id } = useStoreId();

  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { mutateAsync, isPending: isMutatingWishlist } = useAddToWishlist();
  const { mutateAsync: mutateCart, isPending: isMutatingCart } = useAddToCart();
  const {
    data: wishList,
    isFetching: isFetchingWishlist,
    isError,
    isPaused,
    isPending: isPendingWishlist,
  } = useWishlist();

  const inWishlist = wishList?.find(
    (item: WishlistType) => item?.id === productId
  );

  const addedToWishlist = inWishlist?.id === productId;
  const { width } = useWindowDimensions();
  const [qty, setQty] = useState(1);
  const {
    data,
    isFetching,
    isPending,
    error,
    isPaused: isProductPaused,
    refetch,
  } = useProduct(productId);
  const {
    data: category,
    isPending: isCategoryPending,
    isFetching: isCategoryFetching,
    isError: isCategoryError,
    isPaused: isCategoryPaused,
  } = useProductCat(data?.category as string);
  if (isPaused || isProductPaused || isCategoryPaused) {
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
          onPress={refetch}
          text="Retry"
        />
      </View>
    );
  }

  if (error || isError || isCategoryError) {
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
          onPress={refetch}
          text="Retry"
        />
      </View>
    );
  }

  const handelIncrease = () => {
    if (data?.available && qty < +data?.available) {
      setQty((prevQty) => prevQty + 1);
    }
  };
  const handleDecrease = () => {
    if (qty > 1) {
      setQty((prevQty) => prevQty - 1);
    }
  };

  const handleWishlist = async (productId?: string, id?: any) => {
    mutateAsync(productId as string, id);
  };
  const source: HTMLSource = {
    html: `${data?.description}`,
  };
  const arrow = '\u2192';
  return (
    <Container>
      <NavigationHeader back title="Details" />

      {isFetching || isPending ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <ActivityIndicator animating={true} size="large" color="black" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          <Card
            style={{ marginTop: 30, gap: 5 }}
            contentStyle={{
              padding: 10,
              backgroundColor: 'white',
              elevation: 0,
              shadowColor: 'transparent',
            }}
          >
            <Card.Title
              title={data?.product}
              titleStyle={{ fontWeight: 'bold', color: 'black' }}
            />
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{
                  uri: `https://247pharmacy.net/Uploads/${productId}.jpg`,
                }}
                style={{ width: 250, height: 150 }}
                contentFit="contain"
              />
            </View>
            <Card.Content style={{ marginVertical: 10, gap: 5 }}>
              <View
                style={{
                  gap: 5,
                }}
              >
                <Text variant="titleSmall" style={{ color: 'black' }}>
                  Sold by: {data?.seller}
                </Text>
                <Pressable
                  style={({ pressed }) => [pressed && { opacity: 0.5 }]}
                  onPress={() =>
                    router.push({
                      pathname: `/seller/${data?.sellerid}`,
                      params: { seller: data?.seller },
                    })
                  }
                >
                  <Text style={{ color: 'skyblue', fontWeight: 'bold' }}>
                    {'Check out more products from this seller'}
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'skyblue',
                        fontSize: 20,
                      }}
                    >
                      {arrow}
                    </Text>
                  </Text>
                </Pressable>
              </View>
              <Text variant="titleSmall" style={{ color: 'black' }}>
                Category: {data?.category}
              </Text>

              <View>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 18,
                    // marginBottom: -0,
                  }}
                >
                  Description
                </Text>
                <RenderHtml source={source} contentWidth={width} />
              </View>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginVertical: 20,
                }}
              />
              <Text variant="labelMedium" style={{ color: 'black' }}>
                Available: {data?.available}
              </Text>
              <Text
                variant="displaySmall"
                style={{ fontWeight: 'bold', color: 'black' }}
              >
                ₦{data?.sellingprice}
              </Text>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginVertical: 20,
                }}
              />
            </Card.Content>
            <Card.Actions style={{ flex: 1 }}>
              <CounterCartButton
                onAddToCart={() =>
                  mutateCart({ productId: productId as string, qty })
                }
                qty={qty}
                onIncrease={handelIncrease}
                onDecrease={handleDecrease}
                addToWishlist={() => handleWishlist(productId as string, id)}
                loading={isMutatingWishlist}
                inWishlist={addedToWishlist || isFetchingWishlist}
                addingToCart={isMutatingCart}
              />
            </Card.Actions>
          </Card>
          <View
            style={{
              marginVertical: 20,
              width: '100%',
              borderColor: 'gray',
              borderWidth: StyleSheet.hairlineWidth,
            }}
          />
          {category && category?.length > 0 && (
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: 10,
                  fontSize: 18,
                }}
              >
                You might also like
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {isCategoryPending || isCategoryFetching ? (
                  <ActivityIndicator animating={true} size="large" />
                ) : (
                  category
                    ?.slice(0, 5)
                    .map((item) => (
                      <ProductItem {...item} key={item.id} alsoLike />
                    ))
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
      <FloatingNav />
    </Container>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({});
