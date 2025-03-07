import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {Image} from 'expo-image';
import {trimTitle} from '../lib/helpers';
import {Link} from 'expo-router';
import {MyButton} from './MyButton';
import {colors} from '../constants/Colors';
import {useStoreId} from '../lib/zustand/auth';
import {useRemoveFromWishlist} from "../lib/mutation";

type Props = {
  id?: string;
  title?: string;
  price?: string;
  category: string;
};

const Wishlist = ({ id, category, price, title }: Props) => {
  const { id: userId } = useStoreId();

  const {mutateAsync, isPending} = useRemoveFromWishlist(id!, userId);


  return (
    <View
      style={{
        minHeight: 150,
        alignItems: 'center',
        justifyContent: 'center', backgroundColor: 'white',
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
              placeholderContentFit="contain"
              placeholder={require('../assets/images/place.jpg')}
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
          disabled={isPending}
          onPress={mutateAsync}
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


