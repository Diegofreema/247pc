import { StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';

type Props = {
  isPending: boolean;
};

export const AuthModal = ({ isPending }: Props): JSX.Element => {
  return (
    <Modal isVisible={isPending}>
      <View>
        <ActivityIndicator size={'large'} color="black" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
