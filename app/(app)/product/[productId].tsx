import {
  StyleSheet,
  View,
  useWindowDimensions,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct, useProductCat, useWishlist } from '../../../lib/queries';
import Container from '../../../components/Container';
import NavigationHeader from '../../../components/NavigationHeader';
import { Card, Text } from 'react-native-paper';
import RenderHtml, { HTMLSource } from 'react-native-render-html';
import { ActivityIndicator } from 'react-native-paper';
import {
  PinchGestureHandlerGestureEvent,
  ScrollView,
} from 'react-native-gesture-handler';
import CounterCartButton from '../../../components/CounterCartButton';
import { useAddToCart, useAddToWishlist } from '../../../lib/mutation';
import { useStoreId } from '../../../lib/zustand/auth';
import { WishlistType } from '../../../lib/types';
import { Image } from 'expo-image';
import { colors } from '../../../constants/Colors';
import { ProductItem } from '../../../components/ProductItem';
import { MyButton } from '../../../components/MyButton';
import { FloatingNav } from '../../../components/FloatingNav';
import {
  Gesture,
  GestureDetector,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorComponent } from '../../../components/ErrorComponent';
import { useImageModalState } from '../../../lib/zustand/imageModal';
import { ImageModal } from '../../../components/ImageModal';
type Props = {};

const ProductDetail = (props: Props) => {
  const { id } = useStoreId();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { onOpen } = useImageModalState();

  const { productId } = useLocalSearchParams();
  console.log('🚀 ~ ProductDetail ~ productId:', productId);
  const queryClient = useQueryClient();
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
  const onPress = () => {
    onOpen();
  };

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

  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  const { show } = useToast();
  const {
    data: category,
    isPending: isCategoryPending,
    isFetching: isCategoryFetching,
    isError: isCategoryError,
    isPaused: isCategoryPaused,
  } = useProductCat(data?.category as string);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  if (
    isPaused ||
    isProductPaused ||
    isCategoryPaused ||
    error ||
    isError ||
    isCategoryError
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  const handelIncrease = () => {
    if (data?.available && qty < +data?.available) {
      setQty((prevQty) => prevQty + 1);
      queryClient.invalidateQueries({ queryKey: ['product'] });
    }
  };
  const handleDecrease = () => {
    if (qty > 1) {
      setQty((prevQty) => prevQty - 1);
      queryClient.invalidateQueries({ queryKey: ['product'] });
    }
  };

  const scrollTopFn = () => {
    scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
    console.log('🚀 ~ scrollTopFn ~ scrollTopFn');
  };

  const handleWishlist = async () => {
    setAddingToWishlist(true);
    try {
      await axios.post(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=addtowishlist&productid=${productId}&myuserid=${id}`
      );
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      show('Added to wishlist', {
        type: 'success',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    } catch (error) {
      show('Something went wrong adding to wishlist', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    } finally {
      setAddingToWishlist(false);
    }
  };
  const removeFromWishList = async () => {
    setAddingToWishlist(true);
    try {
      await axios.post(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=removewishlist&productid=${productId}&myuserid=${id}`
      );
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } catch (error) {
      show('Something went wrong', {
        type: 'danger',
        animationType: 'slide-in',
        placement: 'bottom',
      });
    } finally {
      setAddingToWishlist(false);
    }
  };
  const toggleWishList = () => {
    if (addedToWishlist) {
      removeFromWishList();
    } else {
      handleWishlist();
    }
  };
  console.log(typeof data);
  const source: HTMLSource = {
    html: `<p style="font-size: 1rem; line-height: 1.5">
    ${data?.description || 'No description available'}
    </p>`,
  };

  const tagStyle = {
    body: {
      whiteSpace: 'normal',
      color: 'black',
      fontSize: 13,
    },

    p: {
      fontFamily: 'Poppins',
    },
  };

  return (
    <Container>
      <NavigationHeader back title="Details" />

      {isPending ? (
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
          refreshControl={
            <RefreshControl refreshing={isPending} onRefresh={handleRefetch} />
          }
          zoomScale={1}
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
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
              titleStyle={{
                color: 'black',
                fontFamily: 'PoppinsBold',
                fontSize: 15,
              }}
            />
            <ImageModal
              image={`https://247pharmacy.net/Uploads/${productId}.jpg`}
            />
            <Pressable style={{ alignItems: 'center' }} onPress={onPress}>
              <Image
                source={{
                  uri: `https://247pharmacy.net/Uploads/${productId}.jpg`,
                }}
                style={[{ width: 250, height: 250 }]}
                contentFit="contain"
              />
            </Pressable>

            <Card.Content style={{ marginVertical: 10, gap: 5 }}>
              <View
                style={{
                  gap: 5,
                }}
              >
                <Text
                  variant="titleSmall"
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins',
                    fontSize: 13,
                  }}
                >
                  Sold by: {data?.seller}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    pressed && { opacity: 0.5 },
                    { paddingVertical: 5 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: `/seller/${data?.sellerid}`,
                      params: { seller: data?.seller },
                    })
                  }
                >
                  <Text
                    style={{
                      color: colors.lightGreen,
                      fontFamily: 'PoppinsBold',
                      fontSize: 11,
                    }}
                  >
                    {'Check out more products from this seller'}
                  </Text>
                </Pressable>
              </View>
              <Text
                variant="titleSmall"
                style={{ color: 'black', fontFamily: 'Poppins', fontSize: 12 }}
              >
                Category: {data?.category}
              </Text>

              <View>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'PoppinsMedium',
                    fontSize: 15,
                    // marginBottom: -0,
                  }}
                >
                  Description
                </Text>
                <RenderHtml
                  source={source}
                  contentWidth={width}
                  /* @ts-ignore */
                  tagsStyles={tagStyle}
                  enableExperimentalMarginCollapsing={true}
                />
              </View>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginVertical: 20,
                }}
              />
              <Text
                variant="labelMedium"
                style={{ color: 'black', fontFamily: 'Poppins', fontSize: 15 }}
              >
                Available: {data?.available}
              </Text>
              <Text
                variant="displaySmall"
                style={{
                  fontFamily: 'PoppinsBold',
                  fontSize: 15,
                  color: 'black',
                }}
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
                addToWishlist={toggleWishList}
                loading={addingToWishlist}
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
                  color: 'black',
                  marginBottom: 10,
                  fontFamily: 'PoppinsBold',
                  fontSize: 15,
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
                  <View
                    style={{
                      marginTop: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <ActivityIndicator
                      animating={true}
                      size="large"
                      color="black"
                    />
                  </View>
                ) : (
                  category
                    ?.slice(0, 5)
                    .map((item) => (
                      <ProductItem
                        key={item?.id}
                        {...item}
                        alsoLike
                        scroll={scrollTopFn}
                      />
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
