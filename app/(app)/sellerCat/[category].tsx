import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../../components/Container';
import { FloatingNav } from '../../../components/FloatingNav';
import { MyButton } from '../../../components/MyButton';
import NavigationHeader from '../../../components/NavigationHeader';
import { ProductItem } from '../../../components/ProductItem';
import { colors } from '../../../constants/Colors';
import { useSellerCat } from '../../../lib/queries';

const SellerCat = () => {
  const { category, id } = useLocalSearchParams();

  const { data, isPending, isFetching, isError, isPaused, refetch } =
    useSellerCat(category as string, id as string);
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
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Container>
        <NavigationHeader back title={category as string} />
        <View style={{ marginTop: 20 }} />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
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
        <FloatingNav />
      </Container>
    </View>
  );
};

export default SellerCat;
