import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { trimTitle } from '../lib/helpers';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Rating from './Rating';

type Props = {
  id?: string;
  title?: string;
  price?: string;
  category: string;
};

const Wishlist = ({ id, category, price, title }: Props) => {
  return (
    <View
      style={{ minHeight: 150, alignItems: 'center', justifyContent: 'center' }}
    >
      <Link href={`/product/${id}`} asChild>
        <Pressable
          style={{
            flex: 1,
            flexDirection: 'row',
            gap: 25,
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 0.4, alignItems: 'center', gap: 10 }}>
            <Image
              source={`https://247pharmacy.net/Uploads/${id}.jpg`}
              style={{
                width: 100,
                height: 100,
              }}
              contentFit="contain"
            />
          </View>
          <View style={{ flex: 0.6 }}>
            <Text variant="titleSmall">{category}</Text>
            <Text variant="titleMedium">{trimTitle(title as string)}</Text>
            <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
              ₦{price}
            </Text>
          </View>
        </Pressable>
      </Link>
      <View
        style={{
          borderColor: 'gray',
          borderWidth: StyleSheet.hairlineWidth,
          width: '100%',
        }}
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({});
