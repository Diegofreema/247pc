import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../components/Container';
import { MyButton } from '../../components/MyButton';
import NavigationHeader from '../../components/NavigationHeader';
import { OrderCard } from '../../components/OrderCard';
import { colors } from '../../constants/Colors';
import { useGetFullOrder } from '../../lib/queries';
import { Order } from '../../lib/types';

const OrderScreen = () => {
  const { data, isPending, isPaused, isError, refetch } = useGetFullOrder();

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

  const renderItem = ({ item }: { item: Order }) => {
    return <OrderCard {...item} />;
  };

  return (
    <Container>
      <NavigationHeader back title="My Order" />
      <View style={{ marginBottom: 20 }} />
      <FlatList
        onRefresh={refetch}
        refreshing={isPending}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'PoppinsBold',
              fontSize: 20,
            }}
          >
            You have no orders yet
          </Text>
        }
      />
    </Container>
  );
};

export default OrderScreen;
