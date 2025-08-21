import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { Order } from '../lib/types';
import { OrderedProductCard } from './OrderedProductCard';
import { RatingForm } from './RatingForm';

export const OrderCard = (item: Order) => {
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
