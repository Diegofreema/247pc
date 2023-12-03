import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  View,
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import {
  useGetRecentlyViewed,
  useNewArrival,
  useSpecial,
} from '../../lib/queries';
import ProductCard, { ProductProps } from '../../components/ProductCard';
import { Text } from 'react-native-paper';
import { TopHeader } from '../../components/TopHeader';
import { Image } from 'expo-image';
import { useStoreId } from '../../lib/zustand/auth';
import { useRouter } from 'expo-router';
const width = Dimensions.get('window').width;
export default function TabOneScreen() {
  const { id, user } = useStoreId();
  console.log(id);

  const router = useRouter();
  const {
    data: recentlyViewed,
    isFetching: isFetchingRecentlyViewed,
    isPending: isPendingRecentlyViewed,
    isPaused: isPausedRecentlyViewed,
    error: errorRecentlyViewed,
  } = useGetRecentlyViewed();

  const {
    data: special,
    isFetching: isFetchingSpecial,
    isPaused,
    isPending: isPendingSpecial,

    error,
  } = useSpecial(user?.statename.toLowerCase() as string);
  const {
    data: newArrival,
    isFetching: isFetchingNewArrival,
    isPending,
    isPaused: isPausedNew,
    error: errorNew,
  } = useNewArrival();
  if (error || errorNew) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
      </View>
    );
  }

  if (isPaused || isPausedNew) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingBottom: 40 }}
    >
      <TopHeader />
      <View style={{ marginBottom: 20, flex: 1 }}>
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
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 10,
                marginTop: 20,
                color: '#000',
              }}
            >
              Special offers
            </Text>

            {Array.isArray(special) && special.length > 0 ? (
              <View>
                {special?.map((item) => {
                  return (
                    <Pressable
                      onPress={() => router.push(`/special/${item.id}`)}
                      style={styles.imageContainer}
                      key={item.id}
                    >
                      <Image
                        source={`https://247pharmacy.net/Uploads/specialoffer-${item.id}.jpg`}
                        style={styles.image}
                        contentFit="contain"
                      />
                    </Pressable>
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
            marginVertical: 20,
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
                fontWeight: 'bold',
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
                  return (
                    <Pressable
                      onPress={() => router.push(`/product/${item?.id}`)}
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
                        style={{ width: 250, height: 100, marginBottom: 5 }}
                        contentFit="contain"
                      />
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: '400',
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
                          fontWeight: '600',
                          fontSize: 17,
                          marginBottom: 5,
                          textAlign: 'center',
                        }}
                      >
                        {item?.product}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: 20,
                          textAlign: 'center',
                        }}
                      >
                        ₦{item?.sellingprice}
                      </Text>
                    </Pressable>
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
                  style={{ color: '#000', fontWeight: 'bold' }}
                >
                  No new arrivals yet.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={{ marginBottom: 20, flex: 1 }}>
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
                  fontSize: 15,
                  fontWeight: 'bold',
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
                }}
              >
                {recentlyViewed?.map((item) => {
                  return (
                    <Pressable
                      onPress={() => router.push(`/product/${item?.id}`)}
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
                        style={{ width: 250, height: 100, marginBottom: 5 }}
                        contentFit="contain"
                      />
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: '400',
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
                          fontWeight: '600',
                          fontSize: 17,
                          marginBottom: 5,
                          textAlign: 'center',
                        }}
                      >
                        {item?.product}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: 20,
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
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: width * 0.9,
    height: 200,
    overflow: 'hidden',
    marginBottom: 3,
    borderRadius: 6,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
});
