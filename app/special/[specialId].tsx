import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStoreId } from '../../lib/zustand/auth';
import { useSpecialInfo } from '../../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import axios from 'axios';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { WishlistType } from '../../lib/types';

type Props = {};

const Special = (props: Props) => {
  const { specialId } = useLocalSearchParams();
  const { user } = useStoreId();
  const [products, setProducts] = useState<WishlistType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data, isPaused, isFetching, isPending, error } = useSpecialInfo(
    user?.statename,
    specialId as string
  );

  useEffect(() => {
    setLoading(true);
    if (data && data[0]?.productlist) {
      axios
        .get(
          `https://247api.netpro.software/api.aspx?api=specialofferproducts&productlist=${data[0]?.productlist}`
        )
        .then(({ data }) => {
          setProducts(data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [data]);

  //   const { data: products } = useSpecialOfferProducts(data.productlist);

  if (isPaused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  if (error) {
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
      <NavigationHeader back title={data && (data[0]?.GroupTitle as string)} />
      <View style={{ marginBottom: 20 }} />
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        {isPending || isFetching || loading ? (
          <ActivityIndicator color="black" size={'large'} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            data={products}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/product/${item?.id}`)}
                style={{ alignItems: 'center', gap: 5, marginBottom: 20 }}
              >
                <Image
                  source={`https://247pharmacy.net/Uploads/${item?.id}.jpg`}
                  style={{ width: 200, height: 200 }}
                />
                <Text style={{ color: 'black' }}>{item?.category}</Text>
                <Text style={{ color: 'black' }}>{item?.product}</Text>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                  ₦{item?.sellingprice}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item?.id}
            initialNumToRender={10}
          />
        )}
      </View>
    </Container>
  );
};

export default Special;

const styles = StyleSheet.create({});
