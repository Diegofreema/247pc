import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  View,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import {
  Id,
  useGetProfile,
  useGetRecentlyViewed,
  useNewArrival,
  useSpecial,
} from '../../../lib/queries';
import { Text } from 'react-native-paper';
import { TopHeader } from '../../../components/TopHeader';
import { Image } from 'expo-image';
import { useStoreId } from '../../../lib/zustand/auth';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import axios from 'axios';
import { ErrorComponent } from '../../../components/ErrorComponent';
import { useQueryClient } from '@tanstack/react-query';
export const checkTextLength = (text: string) => {
  if (text.length > 30) {
    return text.substring(0, 30) + '...';
  }

  return text;
};

const api = process.env.EXPO_PUBLIC_API_URL;
const width = Dimensions.get('window').width;
export default function TabOneScreen() {
  const { id, getId } = useStoreId();

  // const [special, setSpecial] = useState<Id[]>([]);
  // console.log('🚀 ~ TabOneScreen ~ special:', special);
  // const [error, setError] = useState(false);
  // const [isPendingSpecial, setIsPendingSpecial] = useState(false);

  // const refetchSpecial = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://247api.netpro.software/api.aspx?api=specialoffers&statename=${user?.statename?.toLowerCase()}`
  //     );

  //     if (Array.isArray(response.data)) {
  //       setSpecial(response.data);
  //     } else if (typeof response.data === 'object' && response?.data !== null) {
  //       setSpecial([response?.data]);
  //     } else {
  //       setSpecial([]); // Set to an empty array if the response data is neither an array nor an object
  //     }
  //   } catch (error) {
  //     setError(true);
  //   }
  // };

  useEffect(() => {
    getId();
  }, []);
  const {
    data: user,
    isPending: isPendingUser,
    isError: isErrorUser,
    refetch: refetchUser,
    isPaused: isPausedUser,
  } = useGetProfile(id);

  const {
    data: special,
    isPending: isPendingSpecial,
    isError: isErrorSpecial,
    refetch: refetchSpecial,
    isPaused: isPausedSpecial,
  } = useSpecial(user?.statename?.toLowerCase());

  console.log('Special', special);

  // useEffect(() => {
  //   const fetchSpecial = async () => {
  //     try {
  //       setIsPendingSpecial(true);
  //       const response = await axios.get(
  //         ` ${api}?api=specialoffers&statename=${user?.statename?.toLowerCase()}`
  //       );
  //       console.log(response?.data);

  //       setSpecial([
  //         ...(Array.isArray(response?.data)
  //           ? response?.data
  //           : [response?.data]
  //         ).filter(Boolean),
  //       ]);
  //     } catch (error) {
  //       setError(true);
  //     } finally {
  //       setIsPendingSpecial(false);
  //     }
  //   };
  //   fetchSpecial();
  // }, [user?.statename]);

  const router = useRouter();

  const {
    data: recentlyViewed,
    isPending: isPendingRecentlyViewed,
    isPaused: isPausedRecentlyViewed,
    error: errorRecentlyViewed,
    refetch: refetchRecentlyViewed,
  } = useGetRecentlyViewed();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);

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
    isPending,
    isPaused: isPausedNew,
    error: errorNew,
    refetch: refetchNew,
  } = useNewArrival();

  const [reload, setReload] = useState(false);

  const handleRefetch = () => {
    // setError(false);

    setReload((prev) => !prev);
    refetchUser();
    refetchSpecial();
    refetchNew();
    refetchRecentlyViewed();
  };

  if (
    isErrorUser ||
    isErrorSpecial ||
    errorNew ||
    errorRecentlyViewed ||
    isPausedUser ||
    isPausedSpecial ||
    isPausedNew ||
    isPausedRecentlyViewed
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (
    isPendingUser ||
    isPendingSpecial ||
    isPending ||
    isPendingRecentlyViewed
  ) {
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
      <View
        style={{ marginTop: 10, backgroundColor: 'white', paddingBottom: 10 }}
      >
        <TopHeader />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={handleRefetch} />
        }
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: 'white' }}
      >
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
        {!special?.length && (
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
                alignItems: 'center',
              }}
            >
              No new special offers yet.
            </Text>
          </View>
        )}
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
              {Array.isArray(newArrival) && newArrival?.length ? (
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
                      <View key={item?.id}>
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
                        >
                          <Image
                            source={`https://247pharmacy.net/Uploads/${item?.id}.jpg`}
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
                            {checkTextLength(item?.product || '')}
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
                    marginBottom: 30,
                  }}
                >
                  Recently Viewed
                </Text>
              )}
              {Array.isArray(recentlyViewed) && recentlyViewed?.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    marginBottom: 10,
                    paddingBottom: 20,
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
                        key={item?.id}
                      >
                        <Image
                          source={`https://247pharmacy.net/Uploads/${item?.id}.jpg`}
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
                          {checkTextLength(item?.product || '')}
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
});
