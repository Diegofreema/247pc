import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Container from '../../components/Container';
import { FloatingNav } from '../../components/FloatingNav';
import { MyButton } from '../../components/MyButton';
import NavigationHeader from '../../components/NavigationHeader';
import { SubCat } from '../../components/SubCat';
import { colors } from '../../constants/Colors';
import { useCat } from '../../lib/queries';

const NewCat = () => {
  const { data, isPending, isFetching, isError, isPaused, refetch } = useCat();
  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  if (isPaused) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Container>
        <NavigationHeader title="New" back />
        <View style={{ marginTop: 20 }} />
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          {isPending || isFetching ? (
            <ActivityIndicator size={'large'} color="black" animating />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={({ item, index }) => (
                <SubCat chief category={item?.productgroup} index={index} />
              )}
              keyExtractor={(item) => item?.productgroup}
              contentContainerStyle={{
                gap: 10,
                paddingBottom: 40,
              }}
              ListEmptyComponent={
                <Text
                  style={{
                    fontFamily: 'PoppinsMedium',
                    fontSize: 20,
                    color: 'black',
                  }}
                >
                  No Products
                </Text>
              }
              numColumns={2}
            />
          )}
          <FloatingNav />
        </View>
      </Container>
    </View>
  );
};

export default NewCat;
