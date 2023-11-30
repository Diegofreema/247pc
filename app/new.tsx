import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { useCat } from '../lib/queries';
import { ActivityIndicator } from 'react-native-paper';
import { SubCat } from '../components/SubCat';
import NavigationHeader from '../components/NavigationHeader';
import Container from '../components/Container';

type Props = {};

const newCat = (props: Props) => {
  const { data, isPending, isFetching, isError, isPaused } = useCat();
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
      <NavigationHeader title="New" back />
      <View style={{ marginTop: 20 }} />
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        {isPending || isFetching ? (
          <ActivityIndicator size={'large'} color="black" animating />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item, index }) => (
              <SubCat chief category={item?.productgroup} index={index} />
            )}
            keyExtractor={(item) => item?.productgroup}
            contentContainerStyle={{
              gap: 10,
              paddingBottom: 40,
            }}
            ListEmptyComponent={() => (
              <Text
                style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}
              >
                No Products
              </Text>
            )}
            numColumns={2}
          />
        )}
      </View>
    </Container>
  );
};

export default newCat;

const styles = StyleSheet.create({});
