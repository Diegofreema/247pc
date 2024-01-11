import { StyleSheet, View, Text } from 'react-native';
import { Order } from '../lib/types';
import { Image } from 'expo-image';
import { colors } from '../constants/Colors';
import { MyButton } from './MyButton';

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
    <>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={`https://247pharmacy.net/Uploads/${productid}.jpg`}
          contentFit="contain"
        />
        <Text style={{ fontWeight: '600', color: 'black', fontSize: 16 }}>
          {product}
        </Text>
        <Text style={{ fontWeight: '500', color: 'black', fontSize: 13 }}>
          Sold by {seller}
        </Text>
        <View style={styles.row}>
          <Text style={{ fontWeight: '500', color: 'black', fontSize: 13 }}>
            ₦{price}
          </Text>
          <Text style={{ fontWeight: '500', color: 'black', fontSize: 13 }}>
            Quantity: {qty}
          </Text>
        </View>
        <View style={styles.subCatsContainer}>
          <Text style={{ fontWeight: '500', color: 'white', fontSize: 13 }}>
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
