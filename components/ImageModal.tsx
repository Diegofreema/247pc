import { StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useImageModalState } from '../lib/zustand/imageModal';
import { Image } from 'expo-image';

type Props = {
  image: string;
};

export const ImageModal = ({ image }: Props): JSX.Element => {
  const { isOpen, onClose } = useImageModalState();
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
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',

    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    width: '100%',
    height: '70%',
  },
});
