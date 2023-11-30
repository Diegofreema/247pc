import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
};

export const SearchHeader = ({ value, onChangeText }: Props): JSX.Element => {
  const router = useRouter();
  return (
    <View style={{ marginHorizontal: 20, marginTop: 10, paddingVertical: 20 }}>
      <Pressable
        onPress={() => router.back()}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
        <Searchbar
          value={value as string}
          icon={() => <FontAwesome name="arrow-left" size={20} />}
          onChangeText={onChangeText}
          placeholder="Search"
          placeholderTextColor={'black'}
          style={{
            backgroundColor: 'transparent',
            color: 'black',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 8,
          }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});
