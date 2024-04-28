import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStoreId } from '../../../lib/zustand/auth';
import { useSpecialInfo } from '../../../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../../components/Container';
import NavigationHeader from '../../../components/NavigationHeader';
import axios from 'axios';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { WishlistType } from '../../../lib/types';
import { MyButton } from '../../../components/MyButton';
import { colors } from '../../../constants/Colors';
import { FloatingNav } from '../../../components/FloatingNav';
import { ProductItem } from '../../../components/ProductItem';

type Props = {};

const Special = (props: Props) => {
  const { specialId } = useLocalSearchParams();
  const { user } = useStoreId();
  const [products, setProducts] = useState<WishlistType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data, isPaused, isFetching, isPending, error, refetch } =
    useSpecialInfo(user?.statename, specialId as string);

  useEffect(() => {
    setLoading(true);
    if (data && data[0]?.productlist) {
      axios
        .get(
          ` https://test.omega12x.net/api.aspx?api=specialofferproducts&productlist=${data[0]?.productlist}`
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

  if (error) {
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
        <NavigationHeader
          back
          title={data && (data[0]?.GroupTitle as string)}
        />
        <View style={{ marginBottom: 20 }} />
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          {isPending || isFetching || loading ? (
            <ActivityIndicator color="black" size={'large'} />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
              data={products}
              renderItem={({ item }) => <ProductItem {...item} />}
              keyExtractor={(item) => item?.id}
              initialNumToRender={10}
            />
          )}
        </View>
        <FloatingNav />
      </Container>
    </View>
  );
};

export default Special;

const styles = StyleSheet.create({});
