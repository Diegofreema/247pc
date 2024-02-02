import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  View,
  NativeScrollEvent,
  Animated,
  StatusBar,
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import {
  useGetRecentlyViewed,
  useNewArrival,
  useSpecial,
} from '../../lib/queries';
import { Text } from 'react-native-paper';
import { TopHeader } from '../../components/TopHeader';
import { Image } from 'expo-image';
import { useStoreId } from '../../lib/zustand/auth';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { MyButton } from '../../components/MyButton';
import { colors } from '../../constants/Colors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import axios from 'axios';
import { Toast, useToast } from 'react-native-toast-notifications';

import { AddToCartButton } from '../../components/AddToCartButton';
import { Platform } from 'react-native';
export const checkTextLength = (text: string) => {
  if (text.length > 30) {
    return text.substring(0, 30) + '...';
  }

  return text;
};
const NAVBAR_HEIGHT = 70;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const width = Dimensions.get('window').width;
export default function TabOneScreen() {
  const { id, user, getUser, getId } = useStoreId();
  console.log('🚀 ~ TabOneScreen ~ id:', id, typeof id);
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, NAVBAR_HEIGHT);
  const translateY = diffClamp.interpolate({
    inputRange: [0, NAVBAR_HEIGHT],
    outputRange: [0, -NAVBAR_HEIGHT],
  });

  const router = useRouter();
  const {
    data: recentlyViewed,
    isFetching: isFetchingRecentlyViewed,
    isPending: isPendingRecentlyViewed,
    isPaused: isPausedRecentlyViewed,
    error: errorRecentlyViewed,
  } = useGetRecentlyViewed();
  useEffect(() => {
    getUser();
    getId();
  }, []);

  const {
    data: special,
    isFetching: isFetchingSpecial,
    isPaused,
    isPending: isPendingSpecial,
    refetch,
    error,
  } = useSpecial(user?.statename.toLowerCase() as string);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  useEffect(() => {
    console.log('🚀 ~ TabOneScreen ~ user:', user);
    if (!id.length) {
      <Redirect href="/login" />;
    }
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const currentIndex = Math.round(
      contentOffset.x / Dimensions.get('window').width
    );
    setCurrentIndex(currentIndex);
  };

  useFocusEffect(
    useCallback(() => {
      const timer = setInterval(() => {
        if (special && currentIndex === special?.length - 1) {
          scrollViewRef?.current?.scrollTo({ x: 0, animated: true });
          setCurrentIndex(0);
        } else {
          scrollViewRef?.current?.scrollTo({
            x: (currentIndex + 1) * Dimensions.get('window').width,
            animated: true,
          });
          setCurrentIndex(currentIndex + 1);
        }
      }, 1500);

      return () => {
        clearInterval(timer);
      };
    }, [currentIndex])
  );
  const {
    data: newArrival,
    isFetching: isFetchingNewArrival,
    isPending,
    isPaused: isPausedNew,
    error: errorNew,
  } = useNewArrival();

  const [reload, setReload] = useState(false);

  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };

  if (error || errorNew) {
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

  if (isPaused || isPausedNew) {
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

  return (
    <View>
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: translateY }],
          },
        ]}
      >
        <TopHeader />
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: 20 }}
      >
        <View style={{ flex: 1 }}>
          {isFetchingSpecial || isPendingSpecial ? (
            <View
              style={{
                minHeight: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator animating color="#000" size="large" />
            </View>
          ) : (
            <View style={{ flex: 1, marginTop: 60 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'PoppinsBold',
                  textAlign: 'center',

                  marginTop: 20,
                  color: '#000',
                  marginBottom: -30,
                }}
              >
                Special offers
              </Text>

              {Array.isArray(special) && special?.length > 0 ? (
                <View style={{ flex: 1 }}>
                  <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                  >
                    {special?.map((item, index) => {
                      return (
                        <Pressable
                          onPress={() => router.push(`/special/${item?.id}`)}
                          style={styles.imageContainer}
                          key={item?.id}
                        >
                          <Image
                            source={`https://247pharmacy.net/Uploads/specialoffer-${item?.id}.jpg`}
                            style={styles.image}
                            contentFit="contain"
                          />
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{ color: '#000', fontWeight: 'bold' }}
                  >
                    No Special Offers Yet
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        {!isFetchingSpecial && !isPendingSpecial && (
          <View
            style={{
              marginBottom: 10,
              width: '100%',
              borderColor: 'gray',
              borderWidth: StyleSheet.hairlineWidth,
            }}
          />
        )}
        <View style={{ marginBottom: 20, flex: 1 }}>
          {isFetchingNewArrival || isPending ? null : (
            <View style={styles.container}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'PoppinsBold',
                  textAlign: 'center',
                  marginBottom: 10,
                  marginTop: 20,
                  color: '#000',
                }}
              >
                New Arrivals
              </Text>
              {Array.isArray(newArrival) && newArrival.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {newArrival?.map((item) => {
                    const handlePress = () => {
                      axios
                        .post(
                          `https://247api.netpro.software/api.aspx?api=addtoviewed&productid=${item?.id}&myuserid=${id}`
                        )
                        .then((res) => {
                          console.log(res.data);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                      router.push(`/product/${item?.id}`);
                    };
                    return (
                      <View key={item.id}>
                        <Pressable
                          onPress={handlePress}
                          style={[
                            styles.newArrival,
                            {
                              alignItems: 'center',
                              justifyContent: 'center',

                              marginBottom: 10,
                            },
                          ]}
                          key={item.id}
                        >
                          <Image
                            source={`https://247pharmacy.net/Uploads/${item.id}.jpg`}
                            style={{ width: 250, height: 150, marginBottom: 5 }}
                            contentFit="contain"
                          />
                          <Text
                            style={{
                              color: 'black',
                              fontFamily: 'Poppins',
                              fontSize: 12,
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
                              fontSize: 13,
                              marginBottom: 5,
                              textAlign: 'center',
                            }}
                          >
                            {checkTextLength(item?.product)}
                          </Text>
                          <Text
                            style={{
                              color: 'black',
                              fontFamily: 'PoppinsBold',
                              fontSize: 18,
                              textAlign: 'center',
                            }}
                          >
                            ₦{item?.sellingprice}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{
                      color: '#000',
                      fontWeight: 'bold',
                      fontFamily: 'PoppinsBold',
                      fontSize: 18,
                    }}
                  >
                    No new arrivals yet.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {isFetchingRecentlyViewed || isPendingRecentlyViewed ? null : (
            <View style={styles.container}>
              <View
                style={{
                  marginVertical: 20,
                  width: '100%',
                  borderColor: 'gray',
                  borderWidth: StyleSheet.hairlineWidth,
                }}
              />

              {recentlyViewed && recentlyViewed?.length > 0 && (
                <Text
                  style={{
                    fontFamily: 'PoppinsBold',
                    fontSize: 18,
                    color: '#000',
                    marginBottom: 20,
                  }}
                >
                  Recently Viewed
                </Text>
              )}
              {Array.isArray(recentlyViewed) && recentlyViewed.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    marginBottom: 20,
                    paddingBottom: 50,
                  }}
                >
                  {recentlyViewed?.map((item) => {
                    const handlePress = () => {
                      router.push(`/product/${item?.id}`);
                    };

                    return (
                      <Pressable
                        onPress={handlePress}
                        style={[
                          styles.newArrival,
                          {
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                          },
                        ]}
                        key={item.id}
                      >
                        <Image
                          source={`https://247pharmacy.net/Uploads/${item.id}.jpg`}
                          style={{ width: 200, height: 150, marginBottom: 5 }}
                          contentFit="contain"
                        />
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
                            fontSize: 13,
                            marginBottom: 5,
                            textAlign: 'center',
                          }}
                        >
                          {checkTextLength(item?.product)}
                        </Text>
                        <Text
                          style={{
                            color: 'black',
                            fontFamily: 'PoppinsBold',
                            fontSize: 18,
                            textAlign: 'center',
                          }}
                        >
                          ₦{item?.sellingprice}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    height: 300,
    overflow: 'hidden',
    width: width,
    borderRadius: 6,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  anotherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  newArrival: {
    width: width * 0.45,
    height: 300,
    overflow: 'hidden',
    marginBottom: 10,
    borderRadius: 6,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  pager: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70, // Adjust this based on your header's height
    elevation: 4,
    zIndex: 1000,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
});
