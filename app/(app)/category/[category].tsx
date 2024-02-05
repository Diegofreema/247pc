import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Container from '../../../components/Container';
import NavigationHeader from '../../../components/NavigationHeader';
import { useProductCat } from '../../../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../../../components/ProductItem';
import { MyButton } from '../../../components/MyButton';
import { colors } from '../../../constants/Colors';
import { FloatingNav } from '../../../components/FloatingNav';
// import { FlashList } from '@shopify/flash-list';
type Props = {};

const Cat = (props: Props) => {
  const params = useLocalSearchParams();

  console.log(params?.category);
  const { data, isPending, isFetching, isError, isPaused, refetch } =
    useProductCat(params?.category as string);
  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  if (isPaused) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
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

const styles = StyleSheet.create({});
