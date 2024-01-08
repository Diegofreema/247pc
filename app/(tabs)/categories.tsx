import { useRef, useState } from 'react';
import { categories } from '../../constants';

import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Header from '../../components/Header';
import { ActivityIndicator, Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { TopHeader } from '../../components/TopHeader';
import { useCat, useSubCat } from '../../lib/queries';
import { SubCat } from '../../components/SubCat';
import { Floating } from '../../components/Floating';
import { MyButton } from '../../components/MyButton';
import { colors } from '../../constants/Colors';
import { Cats, subCats } from '../../lib/helpers';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function Categories() {
  const [categories, setCategories] = useState(Cats);
  const [subCategories, setSubCategories] = useState(subCats);
  const [active, setActive] = useState(0);
  const [reload, setReload] = useState(false);
  const router = useRouter();
  const itemRef = useRef<Array<TouchableOpacity | null>>([]);
  const scrollRef = useRef<ScrollView>(null);
  const { height, width } = useWindowDimensions();
  let items = subCats?.[active];

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
  const navigate = (cat: string) => {
    router.push(`/category/${cat}`);
  };
  return (
    <View style={{ flex: 1 }}>
      <TopHeader />

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
          {categories?.map((cat, index) => (
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
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
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
                source={item?.img}
                contentFit="cover"
              />

              {/* <Text>{index}</Text> */}

              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                {item.category}
              </Text>
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
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
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
