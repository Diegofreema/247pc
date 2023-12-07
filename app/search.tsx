import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState } from 'react';
import { SearchHeader } from '../components/SearchHeader';
import Container from '../components/Container';
import { useSearch } from '../lib/queries';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator } from 'react-native-paper';
import { ProductItem } from '../components/ProductItem';
import { MyButton } from '../components/MyButton';
import { colors } from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Searched } from '../lib/types';
import InputComponent from '../components/InputComponent';

const search = () => {
  const { data, isPending, isFetching, isError, isPaused, refetch } =
    useSearch();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('');
  const [price, setPrice] = useState({
    from: '2000',
    to: '5500',
  });

  const [products, setProducts] = useState(data);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (data?.length) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    if (value.length > 2) {
      const filteredData = data?.filter(
        (item) =>
          item?.Dealer?.toLowerCase().includes(value.toLowerCase()) ||
          item?.category?.toLowerCase().includes(value.toLowerCase()) ||
          item?.product?.toLowerCase().includes(value.toLowerCase())
      );
      setProducts(filteredData);
    } else {
      setProducts(data);
    }
  }, [value, data]);
  useEffect(() => {
    handleSort();
  }, [selectedPriceFilter]);
  const handleSort = () => {
    if (!products) return;
    let filteredDataCopy = [...products];

    // Apply price filter
    if (selectedPriceFilter === 'lowToHigh') {
      filteredDataCopy = filteredDataCopy.sort(
        (a, b) => +a.sellingprice - +b.sellingprice
      );
    } else if (selectedPriceFilter === 'highToLow') {
      filteredDataCopy = filteredDataCopy.sort(
        (a, b) => +b.sellingprice - +a.sellingprice
      );
    }
    setProducts(filteredDataCopy);
  };

  const applyFilter = () => {
    if (!products) return;
    let filteredDataCopy = products.slice();
    if (selectedCat) {
      filteredDataCopy = filteredDataCopy.filter(
        (item) => item.category === selectedCat
      );
    }
    if (selectedPharmacy) {
      filteredDataCopy = filteredDataCopy.filter(
        (item) => item.Dealer === selectedPharmacy
      );
    }
    setSelectedPriceFilter('');
    setProducts(filteredDataCopy);
    setShowFilter(false);
  };

  const filterProductsByPrice = () => {
    if (!products) return;

    const filteredDataCopy = products.filter(
      (product) =>
        +product.sellingprice >= +price.from &&
        +product.sellingprice <= +price.to
    );

    setProducts(filteredDataCopy);
  };
  const handlePrice = (val: string, name: string) => {
    setPrice({
      ...price,
      [name]: val,
    });
  };

  if (isPaused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Container>
          <Text>Please check your internet connection</Text>
          <MyButton
            buttonColor={colors.lightGreen}
            onPress={refetch}
            text="Retry"
          />
        </Container>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Container>
          <Text>Something went wrong</Text>
          <MyButton
            buttonColor={colors.lightGreen}
            onPress={refetch}
            text="Retry"
          />
        </Container>
      </View>
    );
  }

  const cat = data?.map(({ category }) => category);
  const pharmacy = data?.map(({ Dealer }) => Dealer);
  const uniquePhar = new Set(pharmacy);
  const uniqueItem = new Set(cat);
  const uniquePharmacy = [...uniquePhar];
  const uniqueCat = [...uniqueItem];
  console.log(price);

  return (
    <View style={{ flex: 1 }}>
      <SearchHeader value={value} onChangeText={setValue} />
      <Container>
        <View
          style={{ marginBottom: 20, backgroundColor: 'red' }}
          // showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              justifyContent: 'center',
            }}
          >
            <MyButton
              text="Reset"
              onPress={() => setProducts(data)}
              buttonColor="transparent"
              textColor="black"
            />
            <MyButton
              text="Filter"
              onPress={() => setShowFilter(true)}
              buttonColor={'transparent'}
              textColor="black"
              style={{ width: 100 }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => setSelectedPriceFilter('lowToHigh')}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedPriceFilter === 'lowToHigh'
                        ? colors.lightGreen
                        : 'white',
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      selectedPriceFilter === 'lowToHigh' ? 'white' : 'black',
                  }}
                >
                  Low to High
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedPriceFilter('highToLow')}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedPriceFilter === 'highToLow'
                        ? colors.lightGreen
                        : 'white',
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      selectedPriceFilter === 'highToLow' ? 'white' : 'black',
                  }}
                >
                  High to Low
                </Text>
              </Pressable>
            </View>
          </View>

          {showFilter && (
            <View style={styles.modal}>
              <FontAwesome
                name="times"
                size={25}
                style={{ position: 'absolute', top: 2, right: 9 }}
                onPress={() => setShowFilter(false)}
              />
              <Text
                style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}
              >
                Filter by
              </Text>
              <View>
                <View style={styles.textCon}>
                  <Text style={{ color: 'black', fontSize: 16 }}>Category</Text>
                </View>
                <View style={{ height: 100 }}>
                  <ScrollView
                    style={{ height: 100 }}
                    contentContainerStyle={styles.filterTextCon}
                  >
                    {uniqueCat?.map((cat) => {
                      return (
                        <Pressable
                          style={[{ paddingBottom: 5 }]}
                          onPress={() => setSelectedCat(cat)}
                          key={cat}
                        >
                          <Text
                            style={[
                              { color: 'black' },
                              selectedCat === cat && styles.activeItem,
                            ]}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
                <View style={styles.textCon}>
                  <Text style={{ color: 'black', fontSize: 16 }}>Pharmacy</Text>
                </View>
                <View style={{ height: 100 }}>
                  <ScrollView contentContainerStyle={styles.filterTextCon}>
                    {uniquePharmacy?.map((cat) => {
                      return (
                        <Pressable
                          style={[{ paddingBottom: 5 }]}
                          onPress={() => setSelectedPharmacy(cat as string)}
                          key={cat}
                        >
                          <Text
                            style={[
                              { color: 'black' },
                              selectedPharmacy === cat && styles.activeItem,
                            ]}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={[styles.textCon, { marginTop: 'auto' }]}>
                  <Text style={{ color: 'black', fontSize: 16 }}>Price(₦)</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <InputComponent
                    value={price.from}
                    onChangeText={(val) => handlePrice(val, 'from')}
                  />
                  <Text style={{ color: 'black' }}>To</Text>
                  <InputComponent
                    value={price.to}
                    onChangeText={(val) => handlePrice(val, 'to')}
                  />
                </View>
                <MyButton
                  text="Apply"
                  onPress={filterProductsByPrice}
                  buttonColor="lightgreen"
                  textColor="white"
                />
              </View>
              <MyButton
                text="Apply"
                onPress={applyFilter}
                buttonColor={colors.lightGreen}
                textColor="white"
              />
            </View>
          )}
        </View>

        {isPending || isFetching ? (
          <ActivityIndicator color="black" size="large" />
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
            <FlashList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}
              data={products}
              renderItem={({ item }) => {
                return <ProductItem {...item} />;
              }}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>No products found</Text>
                </View>
              )}
              estimatedItemSize={1000}
            />
          </View>
        )}
      </Container>
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 10,
    overflow: 'hidden',
    marginTop: 30,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  textCon: {
    borderTopColor: colors.lightGreen,
    borderBottomColor: colors.lightGreen,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    backgroundColor: '#eee',
    marginVertical: 10,
    padding: 5,
  },
  filterTextCon: {
    gap: 5,
  },
  filterButton: {
    padding: 11,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
  },
  activeItem: {
    fontWeight: 'bold',
    color: colors.lightGreen,
  },
});
