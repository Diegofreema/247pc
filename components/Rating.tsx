import { View, Text } from 'react-native';
import React from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
type Props = {
  rating: number;
};

const Rating = ({ rating }: Props) => {
  const stars = [1, 2, 3, 4, 5];

  const renderRating = () => {
    return stars.map((number) => {
      if (Math.floor(rating) >= number) {
        return <AntDesign name="star" key={number} size={20} color="gold" />;
      } else {
        return <AntDesign name="staro" size={20} key={number} color="gold" />;
      }
    });
  };
  return (
    <View>
      <Text>Rating: {renderRating()}</Text>
    </View>
  );
};

export default Rating;
