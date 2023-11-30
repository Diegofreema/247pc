import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import { useProductCat } from '../../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../../components/ProductItem';
// import { FlashList } from '@shopify/flash-list';
type Props = {};

const Cat = (props: Props) => {
  const { category } = useLocalSearchParams();
  const { data, isPending, isFetching, isError, isPaused } = useProductCat(
    category as string
  );
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
      <NavigationHeader back title={category as string} />
      <View style={{ marginTop: 20 }} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPending || isFetching ? (
          <ActivityIndicator size={'large'} color={'black'} animating />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            data={data}
            renderItem={({ item }) => (
              <ProductItem
                category={item?.category}
                id={item?.id}
                product={item?.product}
                sellingprice={item?.sellingprice}
              />
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}
                >
                  No Products
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </Container>
  );
};

export default Cat;

const styles = StyleSheet.create({});
