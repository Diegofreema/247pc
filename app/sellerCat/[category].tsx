import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSellerCat } from '../../lib/queries';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../../components/ProductItem';

type Props = {};

const SellerCat = (props: Props) => {
  const { category, id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isPending, isFetching, isError, isPaused } = useSellerCat(
    category as string,
    id as string
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

  console.log(data);

  return (
    <Container>
      <NavigationHeader back title={category as string} />
      <View style={{ marginTop: 20 }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isPending || isFetching ? (
          <ActivityIndicator color="black" size={'large'} animating />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingTop: 30, paddingBottom: 50 }}
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductItem {...item} />}
          />
        )}
      </View>
    </Container>
  );
};

export default SellerCat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 300,
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
