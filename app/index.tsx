import { ScrollView, Text, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';

import AuthHeader from '../components/AuthHeader';

import Container from '../components/Container';
import InputComponent from '../components/InputComponent';
import { colors } from '../constants/Colors';
import { Redirect, useRouter } from 'expo-router';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { useStoreId } from '../lib/zustand/auth';
import { MyButton } from '../components/MyButton';
import { getProfile } from '../lib/helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
const width = Dimensions.get('window').width;
const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

const index = (props: Props) => {
  const { setId, getUser, setUser, id, getId } = useStoreId();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getId();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof id === 'number') {
      router.replace('/(tabs)/');
    }
  }, [mounted, id, router]);
  const toast = useToast();
  const { values, isSubmitting, errors, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        try {
          const response = await axios.post(
            `https://247api.netpro.software/api.aspx?api=userlogin&emailaddress=${values.email}&pasword=${values.password}`
          );

          if (response.data === 'incorrect email or password') {
            toast.show('Incorrect email or password', {
              type: 'danger',
              placement: 'bottom',
              duration: 4000,

              animationType: 'slide-in',
            });
            return;
          }
          if (response.data === 'failed') {
            toast.show('Something went wrong, try again later', {
              type: 'danger',
              placement: 'bottom',
              duration: 4000,

              animationType: 'slide-in',
            });
            return;
          }
          if (response.data === '') {
            toast.show('Something went wrong, try again later', {
              type: 'danger',
              placement: 'bottom',
              duration: 4000,

              animationType: 'slide-in',
            });
            return;
          }
          setId(response.data);
          const user = await getProfile(response.data);
          setUser(user);
          getUser();
          toast.show('login successful', {
            type: 'success',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });

          router.replace('/(tabs)');
        } catch (error) {
          toast.show('Something went wrong', {
            type: 'error',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
        }
      },
    });

  const { email, password } = values;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <AuthHeader />

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: width * 0.6, height: 150 }}
          contentFit="contain"
        />
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Sign in</Text>
        </View>
      </View>
      <Container>
        <Text
          onPress={() => router.push('/signup')}
          style={{ alignSelf: 'flex-end', color: '#1A91FF', marginTop: 20 }}
        >
          Create an account
        </Text>
        <View style={{ gap: 15 }}>
          <>
            <InputComponent
              label="Email"
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              value={email}
            />
            {touched.email && errors.email && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.email}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Password"
              placeholder="Password"
              keyboardType="default"
              onChangeText={handleChange('password')}
              value={password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.password}
              </Text>
            )}
          </>
          <MyButton
            buttonColor={colors.lightGreen}
            loading={isSubmitting}
            text="Sign in"
            onPress={() => handleSubmit()}
            textColor={'white'}
          />
          <View style={{ marginTop: 20 }}>
            <MyButton
              textColor="#1A91FF"
              onPress={() => router.push('/forgot')}
              text="Cant remember your password?"
            />
          </View>
        </View>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default index;
