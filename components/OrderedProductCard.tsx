import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/Colors';
import { Order } from '../lib/types';

export const OrderedProductCard = ({
  id,
  price,
  product,
  productid,
  qty,
  rateSet,
  seller,
  statuz,
}: Order): JSX.Element => {
  return (
    // @ts-ignore
    <>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={`https://247pharmacy.net/Uploads/${productid}.jpg`}
          contentFit="contain"
          placeholderContentFit="cover"
          placeholder={require('../assets/images/place.jpg')}
        />
        <Text
          style={{
            fontWeight: '600',
            color: 'black',
            fontSize: 16,
            fontFamily: 'Poppins',
          }}
        >
          {product}
        </Text>
        <Text
          style={{
            fontWeight: '500',
            color: 'black',
            fontSize: 13,
            fontFamily: 'Poppins',
          }}
        >
          Sold by {seller}
        </Text>
        <View style={styles.row}>
          <Text
            style={{
              fontWeight: '500',
              color: 'black',
              fontSize: 13,
              fontFamily: 'Poppins',
            }}
          >
            ₦{price}
          </Text>
          <Text
            style={{
              fontWeight: '500',
              color: 'black',
              fontSize: 13,
              fontFamily: 'Poppins',
            }}
          >
            Quantity: {qty}
          </Text>
        </View>
        <View style={styles.subCatsContainer}>
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              fontSize: 13,
              fontFamily: 'Poppins',
            }}
          >
            {statuz}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',

    borderWidth: 1,
    borderColor: 'gray',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
  },
  subCatsContainer: {
    backgroundColor: colors.lightGreen,
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
});
