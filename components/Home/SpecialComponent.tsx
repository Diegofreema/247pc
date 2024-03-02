import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Id } from '../../lib/queries';
import Carousel from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

type Props = {
  special: Id[];
};
const width = Dimensions.get('window').width;
export const SpecialComponent = ({ special }: Props): JSX.Element => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          marginTop: 5,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'PoppinsBold',
            textAlign: 'center',
            marginTop: 10,
            color: '#000',
            marginBottom: -30,
          }}
        >
          Special offer
        </Text>

        {special?.length > 0 && (
          <View style={{ flex: 1 }}>
            <Carousel
              loop
              width={width}
              height={250}
              autoPlay={true}
              data={special}
              scrollAnimationDuration={500}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => router.push(`/special/${item?.id}`)}
                  style={styles.imageContainer}
                  key={item?.id}
                >
                  <Image
                    source={{
                      uri: `https://247pharmacy.net/Uploads/specialoffer-${item?.id}.jpg`,
                    }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </Pressable>
              )}
            />
            {/* <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                >
                  {special?.map((item, index) => {
                    return (
                      <Pressable
                        onPress={() => router.push(`/special/${item?.id}`)}
                        style={styles.imageContainer}
                        key={item?.id}
                      >
                        <Image
                          source={`https://247pharmacy.net/Uploads/specialoffer-${item?.id}.jpg`}
                          style={styles.image}
                          contentFit="contain"
                        />
                      </Pressable>
                    );
                  })}
                </ScrollView> */}
          </View>
        )}

        {special?.length < 1 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 300,
            }}
          >
            <Text
              variant="titleLarge"
              style={{ color: '#000', fontWeight: 'bold' }}
            >
              No Special Offers Available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    height: 300,
    overflow: 'hidden',
    width: width,
    borderRadius: 6,
  },
});
