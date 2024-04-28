import { Text, View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';

import AuthHeader from '../../components/AuthHeader';

import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import { Button } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { SelectList } from 'react-native-dropdown-select-list';

import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useStoreId } from '../../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import { getProfile } from '../../lib/helpers';
import { Community, State } from '../../lib/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGetProfile } from '../../lib/mutation';
import { AuthModal } from '../../components/Modals/AuthModal';

type Props = {};
const width = Dimensions.get('window').width;
const passwordRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .matches(
      passwordRegExp,
      'Password must include at least one capital letter, one number, one lower case letter, and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  state: yup.string().required('State is required'),

  communityId: yup.string().required('Community is required'),
});
const SignUp = (props: Props) => {
  const { setId, getUser, setUser } = useStoreId();
  const toast = useToast();
  const router = useRouter();
  const [error, setError] = useState('');
  const { mutateAsync, isPending, isSuccess } = useGetProfile();

  const [states, setStates] = useState<any[]>([
    { statename: 'abuja', label: 'Abuja' },
    { statename: 'imo', label: 'Imo' },
  ]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([
    { communityname: 'Abaji Central', id: '333' },
    { communityname: 'Abaji North East', id: '328' },
  ]);

  const [loadingCommunities, setLoadingCommunities] = useState(false);

  const { values, isSubmitting, errors, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        state: 'abuja',
        address: '',
        phoneNumber: '',
        confirmPassword: '',

        communityId: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        console.log(values);

        const name = `${values.firstName} ${values.lastName}`;
        const formattedPassword = values.password
          .replace(/[#?\/\\%&]/g, '')
          .replace(/:/g, '');
        const response = await axios.post(
          ` https://test.omega12x.net/api.aspx?api=createaccount&statename=${values.state}&fullname=${name}&phone=${values.phoneNumber}&addres=${values.address}&emailaddress=${values.email}&pasword=${formattedPassword}&communityId=${values.communityId}`
        );

        if (response.data === 'failed') {
          toast.show('Something went wrong, please try again', {
            type: 'danger ',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
          return;
        }
        if (response.data === 'record already exist') {
          toast.show('User already exist', {
            type: 'danger ',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
          return;
        }

        setId(response.data);

        toast.show('Account created successfully', {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });

        router.push('/(app)/(tabs)/');

        return;
      },
    });
  console.log(states);

  const {
    address,
    confirmPassword,
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    state,
  } = values;
  useEffect(() => {
    axios
      .get(' https://test.omega12x.net/api.aspx?api=states')
      .then(({ data }) => {
        console.log('dfgfgfhdh', data);

        setLoadingStates(true);
        let newArray: State[] = data?.map((item: { statename: string }) => {
          return {
            key: item?.statename,
            value: item?.statename,
          };
        });
        console.log('dv', newArray);
        if (newArray && newArray.length > 0) {
          setStates(newArray);
        }

        setLoadingStates(false);
      })
      .catch((error) => {
        setLoadingStates(false);
      });
  }, []);

  useEffect(() => {
    setLoadingCommunities(true);
    if (state && state.length > 0) {
      axios
        .get(
          ` https://test.omega12x.net/api.aspx?api=communities&statename=${state}`
        )
        .then(({ data }) => {
          let newArray: Community[] = data?.map(
            (item: { communityname: string; id: string }) => {
              return {
                key: item.id,
                value: item.communityname,
              };
            }
          );

          setCommunities(newArray);
        })
        .catch((error) => {
          console.log(error);
          setError('Something went wrong, try again later');
        })
        .finally(() => {
          setLoadingCommunities(false);
        });
    }
  }, [state]);

  return (
    <>
      <AuthModal isPending={isPending} />
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
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
            <View style={{ marginTop: 30 }}>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20 }}>
                Sign up
              </Text>
            </View>
          </View>
          <Container>
            <Text
              onPress={() => router.push('/login')}
              style={{
                alignSelf: 'flex-end',
                color: '#1A91FF',
                marginTop: 20,
                fontFamily: 'Poppins',
                fontSize: 10,
              }}
            >
              Already have an account?
            </Text>
            <View style={{ gap: 10 }}>
              <>
                <InputComponent
                  label="First Name"
                  placeholder="First name"
                  keyboardType="default"
                  onChangeText={handleChange('firstName')}
                  value={firstName}
                />
                {touched.firstName && errors.firstName && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.firstName}
                  </Text>
                )}
              </>
              <>
                <InputComponent
                  label="Last Name"
                  placeholder="Last name"
                  keyboardType="default"
                  onChangeText={handleChange('lastName')}
                  value={lastName}
                />
                {touched.lastName && errors.lastName && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.lastName}
                  </Text>
                )}
              </>
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
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  keyboardType="numeric"
                  onChangeText={handleChange('phoneNumber')}
                  value={phoneNumber}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.phoneNumber}
                  </Text>
                )}
              </>
              <>
                {loadingStates ? (
                  <View style={styles2.border}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                    >
                      <Text>Loading...</Text>
                    </View>
                  </View>
                ) : (
                  <SelectList
                    search={false}
                    boxStyles={{
                      ...styles2.border,
                      justifyContent: 'flex-start',
                      backgroundColor: 'white',
                    }}
                    inputStyles={{ textAlign: 'left' }}
                    fontFamily="Poppins"
                    setSelected={handleChange('state')}
                    data={states}
                    save="key"
                    placeholder="Select your state"
                  />
                )}
                {touched.state && errors.state && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.state}
                  </Text>
                )}
              </>
              <>
                {loadingCommunities ? (
                  <View style={styles2.border}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                    >
                      <Text style={{ fontFamily: 'Poppins' }}>Loading...</Text>
                    </View>
                  </View>
                ) : (
                  <SelectList
                    search={false}
                    fontFamily="Poppins"
                    placeholder="Select your community"
                    boxStyles={{
                      ...styles2.border,
                      justifyContent: 'flex-start',
                      backgroundColor: 'white',
                    }}
                    inputStyles={{ textAlign: 'left' }}
                    setSelected={handleChange('communityId')}
                    data={communities}
                    save="key"
                  />
                )}
                {touched.communityId && errors.communityId && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.communityId}
                  </Text>
                )}
              </>
              <>
                <InputComponent
                  label="Street"
                  placeholder="Address"
                  keyboardType="default"
                  onChangeText={handleChange('address')}
                  value={address}
                />
                {touched.address && errors.address && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.address}
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
              <>
                <InputComponent
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  keyboardType="default"
                  onChangeText={handleChange('confirmPassword')}
                  value={confirmPassword}
                  secureTextEntry
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
                labelStyle={{ fontFamily: 'Poppins' }}
              >
                Sign up
              </Button>
            </View>
          </Container>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

export default SignUp;
const styles2 = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    minHeight: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
