import { Link, Stack } from 'expo-router';



import {Text, View} from "react-native";
import Container from "../components/Container";

export default function NotFoundScreen() {
    return (
        <Container>
            <Stack.Screen options={{ title: 'Oops!' }} />

                <View style={{ flex: 1 }}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'  }}>This screen doesn't exist.</Text>
                    <Link href="/">
                        <Text>Go to home screen!</Text>
                    </Link>
                </View>

        </Container>
    );
}
