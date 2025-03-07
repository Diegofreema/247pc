import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../../components/Container';
import { ErrorComponent } from '../../../components/ErrorComponent';
import { FloatingNav } from '../../../components/FloatingNav';
import NavigationHeader from '../../../components/NavigationHeader';
import { ProductItem } from '../../../components/ProductItem';
import { useNewCat } from '../../../lib/queries';
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
