import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { Id } from '../lib/queries';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const Carousel = (special: Id[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const currentIndex = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(currentIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < special?.length - 1) {
        scrollViewRef?.current?.scrollTo({
          x: (currentIndex + 1) * width,
          animated: true,
        });
      } else {
        scrollViewRef?.current?.scrollTo({
          x: 0,
          animated: true,
        });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, special?.length, width]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      >
        {special?.map((item, index) => (
          <Pressable
            onPress={() => router.push(`/special/${item?.id}`)}
            style={styles.imageContainer}
            key={item?.id}
          >
            <Image
              source={`https://247pharmacy.net/Uploads/specialoffer-${item?.id}.jpg`}
              style={styles.image}
              contentFit="contain"
              placeholderContentFit="cover"
              placeholder={require('../assets/images/place.jpg')}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Carousel;
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    height: '100%',
    overflow: 'hidden',

    borderRadius: 6,
    flex: 1,
  },
});
