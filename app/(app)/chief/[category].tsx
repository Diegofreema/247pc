import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Container from '../../../components/Container';
import NavigationHeader from '../../../components/NavigationHeader';
import { useLocalSearchParams } from 'expo-router';
import { useNewCat } from '../../../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../../../components/ProductItem';
import { FlashList } from '@shopify/flash-list';
import { FloatingNav } from '../../../components/FloatingNav';
import { ErrorComponent } from '../../../components/ErrorComponent';
type Props = {};

const Chief = (props: Props) => {
  const { category } = useLocalSearchParams();
  const { data, isPending, isFetching, isError, isPaused, refetch } = useNewCat(
    category as string
  );
  const handleRefetch = () => {
    refetch();
  };
  console.log(category);

  if (isPaused || isError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  console.log(data && data[0].product);

  return (
    <Container>
      <NavigationHeader back title={category as string} />
      <View style={{ marginTop: 30 }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isPending || isFetching ? (
          <ActivityIndicator size={'large'} color="black" animating />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => <ProductItem {...item} />}
            contentContainerStyle={{ paddingBottom: 30 }}
            keyExtractor={(item) => item.id}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}
                >
                  No products found
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

export default Chief;

const styles = StyleSheet.create({});
