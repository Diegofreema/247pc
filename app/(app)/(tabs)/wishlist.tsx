import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavigationHeader from '../../../components/NavigationHeader';
import Container from '../../../components/Container';
import Wishlist from '../../../components/Wishlist';
import {ErrorComponent} from '../../../components/ErrorComponent';
import {useWishlist} from "../../../lib/queries";
import {Loader} from "../../../components/Loader";


const wishlist = () => {

  const {data, isPending, isError, refetch, isRefetching, isRefetchError,} = useWishlist()


  const handleRefetch = async () => {
    await refetch();
  };

  if (isError || isRefetchError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
if (isPending) {
  return <Loader />
}
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                onRefresh={handleRefetch}
                refreshing={isRefetching}
                ListEmptyComponent={
                  <Text style={styles.empty}>Wishlist is currently empty</Text>
                }
              />
            </View>

        </View>
      </Container>
    </View>
  );
};

export default wishlist;

const styles = StyleSheet.create({
  empty: {
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 20,
  },
});
