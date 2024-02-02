import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { useModalState } from '../lib/zustand/modalState';
import { useRouter } from 'expo-router';
import { colors } from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

type Props = {};

export const ModalComponent = ({}: Props): JSX.Element => {
  const { isOpen, onClose } = useModalState();
  const router = useRouter();
  const handleNav = () => {
    onClose();
    router.push('/wallet');
  };
  return (
    <Portal>
      <Modal
        visible={isOpen}
        onDismiss={onClose}
        contentContainerStyle={styles.containerStyle}
      >
        <FontAwesome
          onPress={onClose}
          name="times-circle"
          color="black"
          size={25}
          style={{ position: 'absolute', top: 2, right: 5, color: 'black' }}
        />
        <Text
          variant="titleLarge"
          style={{
            color: 'black',
            fontSize: 14,
            fontFamily: 'PoppinsBold',
          }}
        >
          Balance insufficient
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 7,
            color: 'black',
            fontSize: 13,
            fontFamily: 'PoppinsMedium',
          }}
        >
          There is not enough balance in your wallet to place this order!!
        </Text>
        <Button
          onPress={handleNav}
          buttonColor={colors.lightGreen}
          textColor="white"
          style={{ borderRadius: 6 }}
          labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
        >
          Deposit
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 30,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
});
