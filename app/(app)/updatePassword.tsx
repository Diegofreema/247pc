import { Text, View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';

import AuthHeader from '../../components/AuthHeader';

import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import { Button } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

import { useCommunities, useStates } from '../../lib/queries';
import RNPickerSelect from 'react-native-picker-select';

import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useStoreId } from '../../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import { getProfile } from '../../lib/helpers';

type Props = {};
const width = Dimensions.get('window').width;

const validationSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(5, 'Old password must be at least 5 characters')
    .required('Old password is required'),
  newPassword: yup
    .string()
    .min(5, 'New password must be at least 5 characters')
    .required('New password is required'),
});
const api = process.env.EXPO_PUBLIC_API_URL;
const UpdatePassword = (props: Props) => {
  const { setId, id, getUser, setUser } = useStoreId();
  const toast = useToast();

  const { values, isSubmitting, errors, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: {
        oldPassword: '',
        newPassword: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        const response = await axios.post(
          `${api}?api=updatepassword&myuserid=${id}&oldpasword=${values.oldPassword}&pasword=${values.newPassword}`
        );

        if (response.data === 'incorrect previous password') {
          toast.show('Incorrect previous password', {
            type: 'danger ',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
          return;
        }
        if (response.data === 'saved') {
          toast.show('Password changed successfully', {
            type: 'success',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
          router.back();
        }
      },
    });

  const { newPassword, oldPassword } = values;
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        <AuthHeader />

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: width * 0.6, height: 150 }}
            contentFit="contain"
          />
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 20, fontFamily: 'PoppinsBold' }}>
              Change password
            </Text>
          </View>
        </View>
        <Container>
          <View style={{ gap: 10 }}>
            <>
              <InputComponent
                label="Old Password"
                placeholder="Old password"
                keyboardType="default"
                onChangeText={handleChange('oldPassword')}
                value={oldPassword}
                secureTextEntry
              />
              {touched.oldPassword && errors.oldPassword && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.oldPassword}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="New Password"
                placeholder="New Password"
                keyboardType="default"
                onChangeText={handleChange('newPassword')}
                value={newPassword}
                secureTextEntry
              />
              {touched.newPassword && errors.newPassword && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.newPassword}
                </Text>
              )}
            </>
            <Button
              loading={isSubmitting}
              style={{ marginTop: 20, borderRadius: 5 }}
              mode="contained"
              buttonColor={colors.lightGreen}
              onPress={() => handleSubmit()}
              textColor={'white'}
              labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
            >
              Update
            </Button>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

export default UpdatePassword;
