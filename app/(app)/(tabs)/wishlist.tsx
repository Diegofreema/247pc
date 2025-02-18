import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import NavigationHeader from '../../../components/NavigationHeader';
import Container from '../../../components/Container';
import Wishlist from '../../../components/Wishlist';
import {useStoreId} from '../../../lib/zustand/auth';
import {useFocusEffect} from 'expo-router';
import {ActivityIndicator} from 'react-native-paper';
import {WishlistType} from '../../../lib/types';
import axios from 'axios';
import {ErrorComponent} from '../../../components/ErrorComponent';


const wishlist = () => {
  const { id, user } = useStoreId();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log('🚀 ~ wishlist ~ loading:', loading);
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);
  console.log('🚀 ~ wishlist ~ wishlist:', wishlist);
  const [isError, setIsError] = useState(false);


  const refetch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://test.omega12x.net/api.aspx?api=wishlist&statename=${user?.statename}&myuserid=${id}`
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      setWishlist(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const getWishList = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://test.omega12x.net/api.aspx?api=wishlist&statename=${user?.statename}&myuserid=${id}`
          );
          let data = [];
          if (
            Object.prototype.toString.call(response.data) === '[object Object]'
          ) {
            data.push(response.data);
          } else if (
            Object.prototype.toString.call(response.data) === '[object Array]'
          ) {
            data = [...response.data];
          }

          setWishlist(data);
        } catch (error) {
          setIsError(true);
        } finally {
          setLoading(false);
        }
      };
      getWishList();
    }, [])
  );

  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };

  if (isError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <NavigationHeader title="Wishlist" />
        <View
          style={{
            marginTop: 30,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator animating color="#000" size="large" />
          ) : (
            <View style={{ flex: 1, width: '100%' }}>
              <FlatList
                contentContainerStyle={{ paddingBottom: 70 }}
                showsVerticalScrollIndicator={false}
                data={wishlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Wishlist
                    id={item?.id}
                    title={item?.product}
                    price={item?.sellingprice}
                    category={item?.category}
                    refetch={refetch}
                  />
                )}
                onRefresh={handleRefetch}
                refreshing={loading}
                ListEmptyComponent={
                  <Text style={styles.empty}>Wishlist is currently empty</Text>
                }
              />
            </View>
          )}
        </View>
      </Container>
    </View>
  );
};

export default wishlist;

const styles = StyleSheet.create({
  empty: {
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 20,
  },
});
