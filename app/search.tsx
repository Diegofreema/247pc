import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SearchHeader } from '../components/SearchHeader';
import Container from '../components/Container';
import { useSearch } from '../lib/queries';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../components/ProductItem';

const search = () => {
  const { data, isPending, isFetching, isError, isPaused } = useSearch();
  const [products, setProducts] = useState(data);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (data?.length) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    if (value.length > 2) {
      const filteredData = data?.filter(
        (item) =>
          item?.Dealer?.toLowerCase().includes(value.toLowerCase()) ||
          item?.category?.toLowerCase().includes(value.toLowerCase()) ||
          item?.product?.toLowerCase().includes(value.toLowerCase())
      );
      setProducts(filteredData);
    } else {
      setProducts(data);
    }
  }, [value, data]);
  if (isPaused) {
    return (
      <View style={{ flex: 1 }}>
        <Container>
          <Text>Please check your internet connection</Text>
        </Container>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Container>
          <Text>Something went wrong</Text>
        </Container>
      </View>
    );
  }

  console.log(data);

  return (
    <View style={{ flex: 1 }}>
      <SearchHeader value={value} onChangeText={setValue} />
      <Container>
        {isPending || isFetching ? (
          <ActivityIndicator />
        ) : (
          <FlashList
            showsVerticalScrollIndicator={false}
            data={products}
            renderItem={({ item }) => {
              return <ProductItem {...item} />;
            }}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text>No products found</Text>
              </View>
            )}
            estimatedItemSize={500}
          />
        )}
      </Container>
    </View>
  );
};

export default search;

const styles = StyleSheet.create({});
