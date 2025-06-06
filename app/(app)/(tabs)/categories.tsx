import { useRef, useState } from 'react';

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Floating } from '../../../components/Floating';
import { TopHeader } from '../../../components/TopHeader';
import { Cats, subCats } from '../../../lib/helpers';

export default function Categories() {
  const [categories] = useState(Cats);

  const [active, setActive] = useState(0);

  const router = useRouter();
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  const itemRef = useRef<TouchableOpacity[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  let items = subCats?.[active];

  const handleClick = (index: number) => {
    if (!itemRef?.current) return;
    const selectedItem = itemRef?.current[index];
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
  const navigate = (cat: string) => {
    router.push(`/category/${cat}`);
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 10 }}>
        <TopHeader />
      </View>
      {/* @ts-ignore */}
      <>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 20,
            paddingHorizontal: 16,

            marginVertical: 10,

            paddingBottom: 25,
          }}
        >
          {categories?.map((cat, index) => (
            <TouchableOpacity
              onPress={() => handleClick(index)}
              key={index}
              ref={(el) => {
                if (!itemRef?.current?.[index]) return;
                itemRef.current[index] = el!;
              }}
              style={[
                active === index ? styles.active : styles.normal,
                { zIndex: 1, paddingBottom: 4 },
              ]}
            >
              <Text
                style={[
                  active === index ? styles.activeText : styles.text,
                  { zIndex: 1 },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          showsVerticalScrollIndicator={false}
          data={items}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => navigate(item?.category)}
              style={({ pressed }) => [
                pressed && { opacity: 0.8 },
                {
                  width: width * 0.45,

                  marginRight: index % 2 !== 0 ? 0 : 10,

                  height: 270,
                  backgroundColor: 'white',
                },
                styles.container,
              ]}
            >
              <Image
                style={{
                  width: '100%',
                  height: '80%',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }}
                placeholderContentFit="cover"
                placeholder={require('../../../assets/images/place.jpg')}
                source={item?.img}
                contentFit="cover"
              />

              {/* <Text>{index}</Text> */}

              <View style={{ paddingHorizontal: 8 }}>
                <Text
                  style={{
                    fontFamily: 'PoppinsBold',
                    fontSize: 12,
                    color: 'black',

                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  {item.category}
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item?.category}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 30,
            paddingHorizontal: 16,
          }}
          ListEmptyComponent={
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
          }
          numColumns={2}
        />
      </>

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
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#000',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#000',
  },
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
  },
});
