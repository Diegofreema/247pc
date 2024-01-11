import { StyleSheet, View, Text } from 'react-native';
import { Order } from '../lib/types';
import { RatingForm } from './RatingForm';
import { useState } from 'react';
import { OrderedProductCard } from './OrderedProductCard';
import { Divider } from 'react-native-paper';

export const OrderCard = (item: Order): JSX.Element => {
  return (
    <View style={{ marginBottom: 20, gap: 10 }}>
      <OrderedProductCard {...item} />
      {item.statuz === 'Delivered' && (
        <RatingForm productId={item?.productid} />
      )}
      <Divider style={{ marginVertical: 10 }} />
    </View>
  );
};

const styles = StyleSheet.create({});
