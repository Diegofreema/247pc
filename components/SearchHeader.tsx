import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
};

export const SearchHeader = ({ value, onChangeText }: Props): JSX.Element => {
  const router = useRouter();
  return (
    <View style={{ marginHorizontal: 20, marginTop: 10, paddingVertical: 20 }}>
      <Searchbar
        value={value as string}
        icon={() => (
          <FontAwesome
            name="arrow-left"
            size={20}
            onPress={() => router.back()}
          />
        )}
        onChangeText={onChangeText}
        placeholder="Search by key words"
        placeholderTextColor={'black'}
        style={{
          backgroundColor: 'transparent',
          color: 'black',
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 8,
          fontFamily: 'PoppinsBold',
        }}
        inputStyle={{
          fontFamily: 'PoppinsMedium',
          fontSize: 14,
          color: 'black',
        }}
      />
    </View>
  );
};
