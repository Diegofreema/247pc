import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';

import AuthHeader from '../../components/AuthHeader';

import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import { colors } from '../../constants/Colors';

import axios from 'axios';
import { useFormik } from 'formik';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';
import { api } from '../../lib/contants';
import { passwordRegExp } from '../../lib/helpers';
import { useToken } from '../../lib/zustand/useToken';

const width = Dimensions.get('window').width;

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      passwordRegExp,
      'Password must include at least one capital letter, one number, one lower case letter, and one special character and at least 5 characters long'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const UpdatePassword = () => {
  const id = useToken((state) => state.details.id);
  const removeId = useToken((state) => state.removeId);
  const [securePassword1, setSecurePassword1] = useState(true);
  const [securePassword2, setSecurePassword2] = useState(true);
  const toggle1 = useCallback(() => setSecurePassword1((prev) => !prev), []);
  const toggle2 = useCallback(() => setSecurePassword2((prev) => !prev), []);
  const toast = useToast();

  const { values, isSubmitting, errors, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: {
        password: '',
        confirmPassword: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        const formattedPassword = values.password
          .replace(/[#?\/\\%&]/g, '')
          .replace(/:/g, '');
        try {
          const response = await axios.post(
            `${api}=reset247pharmacypassword2&pasword=${formattedPassword}&myuserid=${id}
`
          );
          //   console.log('response: ' + JSON.stringify(response));

          if (response.data.result === 'updated') {
            toast.show('Success, kindly login', {
              type: 'success',
              placement: 'bottom',
              duration: 4000,
              animationType: 'slide-in',
            });
            removeId();
            router.replace('/login');
            return;
          }
        } catch (error) {
          console.log(error);

          toast.show('Something went wrong', {
            type: 'danger',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
        }
      },
    });

  const { password, confirmPassword } = values;
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
              Reset password
            </Text>
          </View>
        </View>
        <Container>
          <View style={{ gap: 10 }}>
            <>
              <InputComponent
                label="Password"
                placeholder="Enter your password"
                keyboardType="default"
                onChangeText={handleChange('password')}
                value={password}
                secureTextEntry={securePassword1}
                toggleSecureEntry={toggle1}
                password
              />
              {touched.password && errors.password && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.password}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Confirm Password"
                placeholder="Confirm Password"
                keyboardType="default"
                onChangeText={handleChange('confirmPassword')}
                password
                value={confirmPassword}
                secureTextEntry={securePassword2}
                toggleSecureEntry={toggle2}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.confirmPassword}
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
              Reset
            </Button>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

export default UpdatePassword;
