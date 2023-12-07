import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import { useLocalSearchParams } from 'expo-router';
import { useNewCat } from '../../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../../components/ProductItem';
import { FlashList } from '@shopify/flash-list';
import { FloatingNav } from '../../components/FloatingNav';
type Props = {};

const Chief = (props: Props) => {
  const { category } = useLocalSearchParams();
  const { data, isPending, isFetching, isError, isPaused } = useNewCat(
    category as string
  );
  console.log(category);
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
            ListEmptyComponent={() => (
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
            )}
          />
        )}
      </View>
      <FloatingNav />
    </Container>
  );
};

export default Chief;

const styles = StyleSheet.create({});
