import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

import AuthHeader from '../../components/AuthHeader';

import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';
import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import { AuthModal } from '../../components/Modals/AuthModal';
import { MyButton } from '../../components/MyButton';
import { colors } from '../../constants/Colors';
import { useGetProfile } from '../../lib/mutation';
import { useStoreId } from '../../lib/zustand/auth';
import { getProfile } from '../../lib/helpers';
import { api } from '../../lib/contants';

const width = Dimensions.get('window').width;
const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

const index = () => {
  const { setId, setUser } = useStoreId();
  const [secure, setSecure] = useState(true);
  const router = useRouter();
  const { isPending } = useGetProfile();

  const toast = useToast();
  const { values, isSubmitting, errors, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        const formattedPassword = values.password
          .replace(/[#?\/\\%&]/g, '')
          .replace(/:/g, '');
        try {
          const response = await axios.post(
            `${api}=userlogin&emailaddress=${values?.email.toLowerCase()}&pasword=${formattedPassword}`
          );
          console.log(response.data, 'response.data');
          if (response.data === '{result: "failed"}') {
            toast.show('Something went wrong, please try again', {
              type: 'danger ',
              placement: 'bottom',
              duration: 4000,
              animationType: 'slide-in',
            });
            return;
          }

          if (response.data === 'incorrect email or password') {
            toast.show('Incorrect credentials', {
              type: 'danger ',
              placement: 'bottom',
              duration: 4000,
              animationType: 'slide-in',
            });
            return;
          }

          setId(response?.data);
          const user = await getProfile(response?.data);
          setUser(user);
          toast.show('Welcome back!!!', {
            type: 'success',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });

          router.push('/(app)/(tabs)/');
        } catch (error: any) {
          console.log(JSON.stringify(error, null, 2));
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
    <>
      <AuthModal isPending={isPending} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <AuthHeader />

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: width * 0.6, height: 150 }}
            contentFit="contain"
          />
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20 }}>
              Sign in
            </Text>
          </View>
        </View>
        <Container>
          <Text
            onPress={() => router.push('/(auth)/signup')}
            style={{
              alignSelf: 'flex-end',
              color: '#1A91FF',
              marginTop: 20,
              fontFamily: 'Poppins',
              fontSize: 10,
            }}
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
                secureTextEntry={secure}
                password
                toggleSecureEntry={() => setSecure(!secure)}
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
    </>
  );
};

export default index;
