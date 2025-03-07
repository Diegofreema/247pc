import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
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
