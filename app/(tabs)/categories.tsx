import { useRef, useState } from 'react';
import { categories } from '../../constants';

import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Header from '../../components/Header';
import { ActivityIndicator, Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { TopHeader } from '../../components/TopHeader';
import { useCat, useSubCat } from '../../lib/queries';
import { SubCat } from '../../components/SubCat';
import { Floating } from '../../components/Floating';

export default function Categories() {
  const [active, setActive] = useState(0);
  const itemRef = useRef<Array<TouchableOpacity | null>>([]);
  const scrollRef = useRef<ScrollView>(null);
  const { height, width } = useWindowDimensions();
  const { data: allCat, isPending, isFetching, isError, isPaused } = useCat();
  const {
    data: subCat,
    isPending: isPendingSub,
    isFetching: isFetchingSub,
    isError: isErrorSub,
    isPaused: isPausedSub,
  } = useSubCat(allCat?.[active].productgroup as string);

  if (isPaused || isPausedSub) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  if (isError || isErrorSub) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
      </View>
    );
  }

  const handleClick = (index: number) => {
    const selectedItem = itemRef.current[index];
    setActive(index);

    if (selectedItem) {
      selectedItem.measureLayout(
        scrollRef.current! as any,
        (x, y) => {
          scrollRef.current?.scrollTo({
            x: x - 16,
            y: 0,
            animated: true,
          });
        },
        () => {}
      );
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  return (
    <View style={{ flex: 1 }}>
      <TopHeader />
      {isPending || isFetching ? (
        <View
          style={{
            marginTop: 80,
          }}
        >
          <ActivityIndicator size={'large'} color="black" />
        </View>
      ) : (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 20,
              paddingHorizontal: 16,

              marginBottom: 10,

              paddingBottom: 25,
            }}
          >
            {allCat?.map((cat, index) => (
              <TouchableOpacity
                onPress={() => handleClick(index)}
                key={index}
                ref={(el) => (itemRef.current[index] = el)}
                style={[
                  active === index ? styles.active : styles.normal,
                  { zIndex: 1 },
                ]}
              >
                <Text
                  style={[
                    active === index ? styles.activeText : styles.text,
                    { zIndex: 1 },
                  ]}
                >
                  {cat.productgroup}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {isPendingSub || isFetchingSub ? null : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={subCat}
              renderItem={({ item, index }) => (
                <SubCat category={item?.category} index={index} />
              )}
              keyExtractor={(item) => item?.category}
              contentContainerStyle={{
                gap: 10,
                paddingBottom: 30,
                paddingHorizontal: 16,
              }}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}
                  >
                    No Products
                  </Text>
                </View>
              )}
              numColumns={2}
            />
          )}
        </>
      )}

      <Floating />
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    color: '#000',

    borderBottomColor: '#000',
    borderBottomWidth: 2,
    padding: 10,
    height: 50,
  },
  normal: {
    color: '#000',
    height: 50,
    padding: 10,
  },
  activeText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    color: '#000',
  },
});
