import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useImageModalState } from '../lib/zustand/imageModal';

type Props = {
  image: string;
};

export const ImageModal = ({ image }: Props): JSX.Element => {
  const { isOpen, onClose } = useImageModalState();

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
          placeholder={require('../assets/images/place.jpg')}
          placeholderContentFit="contain"
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
