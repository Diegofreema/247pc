import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../../components/Container';
import { ErrorComponent } from '../../../components/ErrorComponent';
import { FloatingNav } from '../../../components/FloatingNav';
import NavigationHeader from '../../../components/NavigationHeader';
import { ProductItem } from '../../../components/ProductItem';
import { useProductCat } from '../../../lib/queries';
// import { FlashList } from '@shopify/flash-list';

const Cat = () => {
  const params = useLocalSearchParams();

  console.log(params?.category);
  const { data, isPending, isFetching, isError, isPaused, refetch } =
    useProductCat(params?.category as string);
  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };

  if (isPaused || isError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  return (
    <Container>
      <NavigationHeader back title={params?.category as string} />
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
            contentContainerStyle={{
              paddingBottom: 50,
              gap: 10,

              paddingHorizontal: 20,
            }}
            data={data}
            renderItem={({ item }) => (
              <ProductItem
                category={item?.category}
                id={item?.id}
                product={item?.product}
                sellingprice={item?.sellingprice}
              />
            )}
            ListEmptyComponent={
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
            }
          />
        )}
      </View>
      <FloatingNav />
    </Container>
  );
};

export default Cat;
