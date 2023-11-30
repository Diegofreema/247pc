import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useCallback } from 'react';
import NavigationHeader from '../../components/NavigationHeader';
import Container from '../../components/Container';
import Wishlist from '../../components/Wishlist';
import { useWishlist } from '../../lib/queries';
import { useStoreId } from '../../lib/zustand/auth';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
type Props = {};

const wishlist = (props: Props) => {
  const { id } = useStoreId();
  console.log(id);

  // const [data, setData] = useState<WishlistType[]>([]);
  const {
    data,
    isFetching,
    isError,
    isPending,
    isPaused,
    refetch,
    isRefetching,
  } = useWishlist();
  console.log(data);
  // useFocusEffect(
  //   useCallback(() => {
  //     let isActive = true;
  //     if (isActive) {
  //       refetch();
  //     }

  //     return () => {
  //       isActive = false;
  //     };
  //   }, [id])
  // );

  if (isPaused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }
  if (isError) {
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
      <NavigationHeader title="Wishlist" />
      <View
        style={{
          marginTop: 30,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPending || isFetching ? (
          <ActivityIndicator animating color="#000" size="large" />
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 70 }}
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Wishlist
                  id={item?.id}
                  title={item?.product}
                  price={item?.sellingprice}
                  category={item?.category}
                />
              )}
              onRefresh={refetch}
              refreshing={isRefetching}
            />
          </View>
        )}
      </View>
    </Container>
  );
};

export default wishlist;

const styles = StyleSheet.create({});
