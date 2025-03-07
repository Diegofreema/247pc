import { Text, Dimensions } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';

import { Link } from 'expo-router';
import { trimTitle } from '../lib/helpers';
import { MyLoader } from './MyLoader';
// import SkeletonContent from 'react-native-skeleton-content';
const { width } = Dimensions.get('window');
export type ProductProps = {
  title?: string;
  price?: number;
  category?: string;
  description?: string;
  image?: string;
  id: any;
  rating?: {
    count?: number;
    rate?: number;
  };
  loading?: boolean;
};

const ProductCard = ({
  title,
  price,
  category,
  description,
  image,
  id,
  loading,
}: ProductProps) => {
  if (loading) {
    return <MyLoader />;
  }
  return (
    <Link asChild href={`/product/${id}`}>
      <Card
        style={{
          width: width * 0.6,
          height: 300,
          marginRight: 10,
          backgroundColor: '#fff',
        }}
      >
        <Card.Cover
          source={{ uri: image }}
          style={{ marginBottom: 20, resizeMode: 'contain' }}
          defaultSource={require('../assets/images/place.jpg')}
          resizeMode="cover"
        />
        <Card.Content>
          <Text style={{ fontSize: 12, fontFamily: 'Poppins' }}>
            {trimTitle(title as string)}
          </Text>
          <Text style={{ fontSize: 15, fontFamily: 'PoppinsMedium' }}>
            ₦{price}
          </Text>
        </Card.Content>
      </Card>
    </Link>
  );
};

export default ProductCard;
