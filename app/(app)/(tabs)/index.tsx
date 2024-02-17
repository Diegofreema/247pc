import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  View,
  NativeScrollEvent,
  Animated,
  RefreshControl,
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import {
  Id,
  useGetRecentlyViewed,
  useNewArrival,
  useSpecial,
  useUser,
} from '../../../lib/queries';
import { Text } from 'react-native-paper';
import { TopHeader } from '../../../components/TopHeader';
import { Image } from 'expo-image';
import { useStoreId } from '../../../lib/zustand/auth';
import { useFocusEffect, useRouter } from 'expo-router';
import { MyButton } from '../../../components/MyButton';
import { colors } from '../../../constants/Colors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import axios from 'axios';
import { ErrorComponent } from '../../../components/ErrorComponent';
import Carousel from 'react-native-reanimated-carousel';
export const checkTextLength = (text: string) => {
  if (text.length > 30) {
    return text.substring(0, 30) + '...';
  }

  return text;
};
const NAVBAR_HEIGHT = 70;
const api = process.env.EXPO_PUBLIC_API_URL;
const width = Dimensions.get('window').width;
export default function TabOneScreen() {
  const { id, getUser, getId, user } = useStoreId();
  console.log('🚀 ~ TabOneScreen ~ id:', id);

  // const [special, setSpecial] = useState<Id[]>([]);
  // const [error, setError] = useState(false);

  console.log(user, 'dfdf');
  // const refetchSpecial = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://247api.netpro.software/api.aspx?api=specialoffers&statename=${user?.statename?.toLowerCase()}`
  //     );

  //     if (Array.isArray(response.data)) {
  //       setSpecial(response.data);
  //     } else if (typeof response.data === 'object' && response.data !== null) {
  //       setSpecial([response.data]);
  //     } else {
  //       setSpecial([]); // Set to an empty array if the response data is neither an array nor an object
  //     }
  //   } catch (error) {
  //     setError(true);
  //   }
  // };

  useEffect(() => {
    getId();
    getUser();
  }, []);
  // useEffect(() => {
  //   const fetchSpecial = async () => {
  //     setIsPendingSpecial(true);
  //     try {
  //       const response = await axios.get(
  //         `https://247api.netpro.software/api.aspx?api=specialoffers&statename=${user?.statename?.toLowerCase()}`
  //       );

  //       if (Array.isArray(response.data)) {
  //         setSpecial(response.data);
  //       } else if (
  //         typeof response.data === 'object' &&
  //         response.data !== null
  //       ) {
  //         setSpecial([response.data]);
  //       } else {
  //         setSpecial([]); // Set to an empty array if the response data is neither an array nor an object
  //       }
  //     } catch (error) {
  //       setError(true);
  //     } finally {
  //       setIsPendingSpecial(false);
  //     }
  //   };
  //   fetchSpecial();
  // }, [user]);
  const {
    data: special,
    isPending: isPendingSpecial,
    isError,
    isPaused,
    refetch,
  } = useSpecial(user?.statename?.toLowerCase());
  const router = useRouter();

  const {
    data: recentlyViewed,
    isPending: isPendingRecentlyViewed,
    isPaused: isPausedRecentlyViewed,
    error: errorRecentlyViewed,
    refetch: refetchRecentlyViewed,
  } = useGetRecentlyViewed();

  // const [currentIndex, setCurrentIndex] = useState(0);
  // const scrollViewRef = useRef<ScrollView | null>(null);

  // const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   const contentOffset = event.nativeEvent.contentOffset;
  //   const currentIndex = Math.round(
  //     contentOffset.x / Dimensions.get('window').width
  //   );
  //   setCurrentIndex(currentIndex);
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     const timer = setInterval(() => {
  //       if (special && currentIndex === special?.length - 1) {
  //         scrollViewRef?.current?.scrollTo({ x: 0, animated: true });
  //         setCurrentIndex(0);
  //       } else {
  //         scrollViewRef?.current?.scrollTo({
  //           x: (currentIndex + 1) * Dimensions.get('window').width,
  //           animated: true,
  //         });
  //         setCurrentIndex(currentIndex + 1);
  //       }
  //     }, 1500);

  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }, [currentIndex])
  // );
  const {
    data: newArrival,

    isPending,
    isPaused: isPausedNew,
    error: errorNew,
    refetch: refetchNew,
  } = useNewArrival();

  const [reload, setReload] = useState(false);

  const handleRefetch = () => {
    setReload((prev) => !prev);
    refetch();
    refetchNew();
    refetchRecentlyViewed();
  };

  if (
    isPausedRecentlyViewed ||
    isPausedNew ||
    isPaused ||
    isError ||
    errorNew ||
    errorRecentlyViewed
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPendingSpecial) {
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <ActivityIndicator color="black" size={'large'} animating />
    </View>;
  }

  if (isPendingSpecial) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <ActivityIndicator color="black" size={'large'} animating />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 10 }}>
        <TopHeader />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={handleRefetch} />
        }
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: 20, backgroundColor: 'white' }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              marginTop: 5,
              marginBottom: -20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PoppinsBold',
                textAlign: 'center',
                marginTop: 10,
                color: '#000',
                marginBottom: -30,
              }}
            >
              Special offer
            </Text>

            {special?.length > 0 && (
              <View style={{ flex: 1 }}>
                <Carousel
                  loop
                  width={width}
                  height={width}
                  autoPlay={true}
                  data={special}
                  scrollAnimationDuration={500}
                  renderItem={({ item, index }) => (
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
                  )}
                />
                {/* <ScrollView
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
                </ScrollView> */}
              </View>
            )}

            {special?.length === 0 && (
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
                  No Special Offers Available
                </Text>
              </View>
            )}
          </View>
        </View>
        {!isPendingSpecial && (
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
          {isPending ? null : (
            <View style={styles.container}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'PoppinsBold',
                  textAlign: 'center',
                  marginBottom: 10,

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
          {isPendingRecentlyViewed ? null : (
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
      </ScrollView>
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
