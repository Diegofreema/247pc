import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { trimTitle } from '../lib/helpers';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Rating from './Rating';
import { MyButton } from './MyButton';
import { colors } from '../constants/Colors';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';

type Props = {
  id?: string;
  title?: string;
  price?: string;
  category: string;
  refetch: () => void;
};

const Wishlist = ({ id, category, price, title, refetch }: Props) => {
  const { id: userId } = useStoreId();
  const [removing, setRemoving] = useState(false);
  const toast = useToast();
  const removeFromWishList = async () => {
    setRemoving(true);
    try {
      await axios.post(
        `https://test.omega12x.net/api.aspx?api=removewishlist&productid=${id}&myuserid=${userId}`
      );
      refetch();
    } catch (error) {
      toast.show('Something went wrong', {
        type: 'danger',
        animationType: 'slide-in',
        placement: 'bottom',
      });
    } finally {
      setRemoving(false);
    }
  };
  return (
    <View
      style={{
        minHeight: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <Link href={`/product/${id}`} asChild>
        <Pressable
          style={{
            flex: 1,
            flexDirection: 'row',
            gap: 25,
            alignItems: 'center',
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flex: 0.4,
              alignItems: 'center',
              gap: 10,
              paddingLeft: 10,
            }}
          >
            <Image
              source={`https://247pharmacy.net/Uploads/${id}.jpg`}
              style={{
                width: 150,
                height: 150,
              }}
              contentFit="contain"
            />
          </View>
          <View style={{ flex: 0.6 }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'PoppinsMedium',
                fontSize: 13,
              }}
              variant="titleSmall"
            >
              {category}
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins',
                fontSize: 11,
              }}
              variant="titleMedium"
            >
              {trimTitle(title as string)}
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'PoppinsBold',
              }}
            >
              ₦{price}
            </Text>
          </View>
        </Pressable>
      </Link>
      <View style={{ marginBottom: 15 }}>
        <MyButton
          disabled={removing}
          onPress={removeFromWishList}
          text="Remove from wishlist"
          buttonColor={colors.danger}
        />
      </View>

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
