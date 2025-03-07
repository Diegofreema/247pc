import {View} from 'react-native';
import {ActivityIndicator} from "react-native-paper";

export const Loader = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
            }}
        >
            <ActivityIndicator color="black" size={'large'} animating />
        </View>
    );
};