import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Container from '../components/Container';
import NavigationHeader from '../components/NavigationHeader';
import { useGetFullOrder } from '../lib/queries';
import { MyButton } from '../components/MyButton';
import { colors } from '../constants/Colors';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { FlatList } from 'react-native';
import { Order } from '../lib/types';
import { OrderCard } from '../components/OrderCard';
type Props = {};

const order = (props: Props) => {
  const { data, isPending, isPaused, isError, refetch } = useGetFullOrder();
  const [comment, setComment] = useState('');
  console.log('🚀 ~ order ~ comment:', comment);

  console.log('🚀 ~ order ~ data:', data);
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

  if (isPending) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color="black" animating size={'large'} />
      </View>
    );
  }

  const ratingCompleted = (rating: number) => {
    console.log('🚀 ~ ratingCompleted ~ rating:', rating);
  };
  const renderItem = ({ item }: { item: Order }) => {
    return <OrderCard {...item} />;
  };

  return (
    <Container>
      <NavigationHeader back title="My Order" />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}
          >
            You have no orders yet
          </Text>
        }
      />
    </Container>
  );
};

export default order;

const styles = StyleSheet.create({
  label: { color: 'black', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  message: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    color: 'black',
    backgroundColor: 'white',
  },
});
