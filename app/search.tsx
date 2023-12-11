import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
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
import InputComponent from '../components/InputComponent';
import Animated from 'react-native-reanimated';

const itemsPerPage = 6;
const search = () => {
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching, isError, isPaused, refetch } =
    useSearch();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string[]>([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('');
  const [price, setPrice] = useState({
    from: '2000',
    to: '5500',
  });

  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
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
    if (!data) return;
    let filteredDataCopy = data?.slice();
    if (selectedCat.length) {
      filteredDataCopy = filteredDataCopy?.filter((item) =>
        selectedCat.includes(item.category)
      );
    }
    if (selectedPharmacy.length) {
      filteredDataCopy = filteredDataCopy?.filter((item) =>
        selectedPharmacy.includes(item.Dealer as string)
      );
    }
    setSelectedPriceFilter('');
    setProducts(filteredDataCopy);
    console.log(filteredDataCopy, 'filteredDataCopy');

    setShowFilter(false);
    setPage(1);
  };

  const filterProductsByPrice = () => {
    if (!data) return;

    const filteredDataCopy = data.filter(
      (product) =>
        +product.sellingprice >= +price.from &&
        +product.sellingprice <= +price.to
    );

    setProducts(filteredDataCopy);
    setSelectedPriceFilter('');
    setShowFilter(false);
    setPage(1);
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
            onPress={handleRefetch}
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
            onPress={handleRefetch}
            text="Retry"
          />
        </Container>
      </View>
    );
  }
  const resetFilter = () => {
    setProducts(data);
    setSelectedCat(['']);
    setSelectedPharmacy(['']);
    setSelectedPriceFilter('');
    setPrice({
      from: '2000',
      to: '5500',
    });
    setShowFilter(false);
    setPage(1);
  };
  const handleSelectedCat = (cat: string) => {
    if (selectedCat.includes(cat)) {
      setSelectedCat(selectedCat.filter((item) => item !== cat));
    } else {
      setSelectedCat([...selectedCat, cat]);
    }
  };

  const handleSelectedPhar = (phar: string) => {
    if (selectedPharmacy.includes(phar)) {
      setSelectedPharmacy(selectedPharmacy.filter((item) => item !== phar));
    } else {
      setSelectedPharmacy([...selectedPharmacy, phar]);
    }
  };
  const cat = data?.map(({ category }) => category);
  const pharmacy = data?.map(({ Dealer }) => Dealer);
  const uniquePhar = new Set(pharmacy);
  const uniqueItem = new Set(cat);
  const uniquePharmacy = [...uniquePhar];
  const uniqueCat = [...uniqueItem];
  console.log(price);
  const totalPages = Math.ceil(products?.length! / itemsPerPage);

  // Calculate the start and end index based on the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = products?.slice(startIndex, endIndex);
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <SearchHeader value={value} onChangeText={setValue} />
      <Container>
        <ScrollView
          style={{
            maxHeight: showFilter ? '100%' : 100,

            paddingBottom: 20,
          }}

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
            <Pressable
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: 'black',
                padding: 11,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={resetFilter}
            >
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Reset</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowFilter(true)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: 'black',
                padding: 11,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Filter</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 5 }}>
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
            <Animated.View style={styles.modal}>
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
                          onPress={() => handleSelectedCat(cat)}
                          key={cat}
                        >
                          <Text
                            style={[
                              { color: 'black' },
                              selectedCat.includes(cat) && styles.activeItem,
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
                          onPress={() => handleSelectedPhar(cat as string)}
                          key={cat}
                        >
                          <Text
                            style={[
                              { color: 'black' },
                              selectedPharmacy.includes(cat as string) &&
                                styles.activeItem,
                            ]}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                  <MyButton
                    text="Apply"
                    onPress={applyFilter}
                    buttonColor={colors.lightGreen}
                    textColor="white"
                  />
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
                  buttonColor={colors.lightGreen}
                  textColor="white"
                />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {isPending || isFetching ? (
          <ActivityIndicator color="black" size="large" />
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              data={currentItems}
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
              ListFooterComponentStyle={{
                marginTop: 15,
                alignItems: 'center',
              }}
              ListFooterComponent={() =>
                isPending || isFetching ? null : (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      width: '80%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MyButton
                      style={{ width: 130 }}
                      text="Previous"
                      textColor="white"
                      buttonColor={colors.lightGreen}
                      onPress={() => setPage(page - 1)}
                      disabled={page === 1}
                    />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}
                    >
                      {' '}
                      {page}
                    </Text>

                    <MyButton
                      style={{ width: 130 }}
                      text="Next"
                      textColor="white"
                      buttonColor={colors.lightGreen}
                      onPress={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    />
                  </View>
                )
              }
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
    width: 100,
    alignItems: 'center',
  },
  activeItem: {
    fontWeight: 'bold',
    color: colors.lightGreen,
  },
});
