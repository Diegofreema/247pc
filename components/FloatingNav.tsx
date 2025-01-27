import {useRouter} from 'expo-router';
import {Pressable, View} from 'react-native';
import {colors} from '../constants/Colors';
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';



export const FloatingNav = () => {

  const router = useRouter();

  return (
    <View
      style={{
        position: 'absolute',
        gap: 10,
        bottom: 15,
        left: 5,
        width: '100%',
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
    >
      <Pressable
        style={{
          backgroundColor: colors.lightGreen,

          width: 50,
          height: 50,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => router.push('/categories')}
      >
        <MaterialIcons name="category" color="white" size={25} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/')}
        style={{
          backgroundColor: colors.lightGreen,
          marginTop: -25,
          width: 50,
          height: 50,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesome name="home" size={25} color="white" />
      </Pressable>
      <Pressable
        onPress={() => router.push('/wishlist')}
        style={{
          backgroundColor: colors.lightGreen,

          width: 50,
          height: 50,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesome name="heart" size={25} color="white" />
      </Pressable>
    </View>
  );
};


