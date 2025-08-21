import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSeller } from '../../../lib/queries';
import Container from '../../../components/Container';
import NavigationHeader from '../../../components/NavigationHeader';
import { ActivityIndicator } from 'react-native-paper';
import { Image } from 'expo-image';
import { FloatingNav } from '../../../components/FloatingNav';
import { ErrorComponent } from '../../../components/ErrorComponent';

const Seller = () => {
  const { sellerId, seller } = useLocalSearchParams();
  const router = useRouter();
  const { data, isPending, isFetching, isError, isPaused, refetch } = useSeller(
    sellerId as string
  );

  const handleRefetch = () => {
    refetch();
  };

  if (isError || isPaused) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  return (
    <Container>
      <NavigationHeader back title={seller as string} />
      <View style={{ marginTop: 20 }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isPending || isFetching ? (
          <ActivityIndicator color="black" size={'large'} animating />
        ) : (
          <FlatList
            ListHeaderComponent={() => (
              <Text
                style={{
                  color: 'black',
                  marginBottom: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Please select the relevant category below to find the
                appropriate products
              </Text>
            )}
            ListEmptyComponent={
              <Text
                style={{ color: 'black', marginBottom: 20, fontWeight: 'bold' }}
              >
                Nothing more from this dealer
              </Text>
            }
            contentContainerStyle={{ paddingTop: 30, paddingBottom: 50 }}
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.groupImageId}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.5 },
                  styles.container,
                ]}
                onPress={() =>
                  router.push(`/sellerCat/${item.category}?id=${sellerId}`)
                }
              >
                <Image
                  source={`https://247pharmacy.net/Uploads/${item.groupImageId}.jpg`}
                  style={{ width: 200, height: 200, marginBottom: 5 }}
                  contentFit="cover"
                  placeholderContentFit="cover"
                  placeholder={require('../../../assets//images/place.jpg')}
                />
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: 10,
                    textAlign: 'center',
                  }}
                >
                  {item.category}
                </Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: '100%',
                  borderColor: 'gray',
                  borderWidth: StyleSheet.hairlineWidth,
                  marginBottom: 50,
                }}
              />
            )}
          />
        )}
      </View>
      <FloatingNav />
    </Container>
  );
};

export default Seller;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 300,
    shadowColor: '#000',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
