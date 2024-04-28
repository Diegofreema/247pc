import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { MyButton } from './MyButton';
import { colors } from '../constants/Colors';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const DeleteModal = ({ visible, onClose }: Props): JSX.Element => {
  const { id, removeId, removeUser } = useStoreId();
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const handleDeleteProfile = async () => {
    setDeleting(true);
    try {
      await axios.post(
        ` https://test.omega12x.net/api.aspx?api=deleteuser&myuserid=${id}`
      );
      removeId();
      removeUser();
      toast.show('Profile deleted successfully', {
        type: 'success',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
      router.replace('/login');
      onClose();
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        style={{ backgroundColor: 'green' }}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
        transparent
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your profile?
            </Text>
            <View style={styles.row}>
              <MyButton
                onPress={handleDeleteProfile}
                text="Delete"
                buttonColor={colors.danger}
                disabled={deleting}
              />
              <MyButton
                onPress={onClose}
                text="Cancel"
                buttonColor={colors.lightGreen}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
});
