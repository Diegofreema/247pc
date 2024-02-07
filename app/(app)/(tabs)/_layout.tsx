import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../../constants/Colors';
import { Text } from 'react-native-paper';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          paddingVertical: 10,
          paddingBottom: 10,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
        },
        tabBarItemStyle: {
          flexDirection: 'column',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome
              name="home"
              color={focused ? '#34d399' : '#000'}
              size={size}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#34d399' : '#000',
                fontFamily: 'PoppinsBold',
                fontSize: 9,
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Entypo
              name="notification"
              size={size}
              color={focused ? '#34d399' : '#000'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#34d399' : '#000',
                fontFamily: 'PoppinsBold',
                fontSize: 9,
              }}
            >
              Categories
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome
              name="heart"
              color={focused ? '#34d399' : '#000'}
              size={size}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#34d399' : '#000',
                fontFamily: 'PoppinsBold',
                fontSize: 9,
              }}
            >
              Wishlist
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome
              name="user"
              color={focused ? '#34d399' : '#000'}
              size={size}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#34d399' : '#000',
                fontFamily: 'PoppinsBold',
                fontSize: 9,
              }}
            >
              Account
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
