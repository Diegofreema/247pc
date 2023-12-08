import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { Image } from 'expo-image';
import NavigationHeader from '../../components/NavigationHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { State } from '../../lib/types';
import { SelectList } from 'react-native-dropdown-select-list';
import InputComponent from '../../components/InputComponent';
import { MyButton } from '../../components/MyButton';
import { colors } from '../../constants/Colors';
import { Checkbox } from 'react-native-paper';
type Props = {};
const validationSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),

  email: yup.string().email('Invalid email').required('Email is required'),

  phoneNumber: yup.string().required('Phone number is required'),

  category: yup.string().required('Category is required'),
  subCategory: yup.string().required('Subcategory is required'),
  regNumber: yup.string().required('Registration number is required'),
  regCountry: yup.string().required('Registration country is required'),
  bio: yup
    .string()
    .required('Bio is required')
    .min(20, 'Bio must be at least 20 characters')
    .max(200, 'Bio must be less than 200 characters'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  acceptTerm: yup
    .boolean()
    .oneOf([true], 'Accept the terms of service agreement'),
});
const { width } = Dimensions.get('window');
const sell = (props: Props) => {
  const [states, setStates] = useState<State[]>([
    { statename: 'abuja', label: 'Abuja' },
    { statename: 'imo', label: 'Imo' },
  ]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [error, setError] = useState('');
  const {
    values,
    isSubmitting,
    errors,
    handleChange,
    handleSubmit,
    touched,
    setValues,
  } = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',

      category: '',
      subCategory: '',
      regNumber: '',
      regCountry: '',
      bio: '',
      password: '',
      confirmPassword: '',
      acceptTerm: false,
    },
    validationSchema,
    onSubmit: async (values) => {},
  });

  useEffect(() => {
    axios
      .get('https://247api.netpro.software/api.aspx?api=states')
      .then(({ data }) => {
        setLoadingStates(true);
        let newArray: State[] = data?.map((item: { statename: string }) => {
          return {
            key: item.statename,
            value: item.statename,
          };
        });

        setStates(newArray);

        setLoadingStates(false);
      })
      .catch((error) => {
        setError('Something went wrong, try again later');
        setLoadingStates(false);
      });
  }, []);
  console.log(values.acceptTerm);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <NavigationHeader back title="Sell On 247pharmacy" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: width * 0.5, height: 150 }}
              contentFit="contain"
            />
            <View style={{ marginTop: 20, marginBottom: 25 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '400',
                  color: '#000',
                  textAlign: 'center',
                }}
              >
                EXPRESSION OF INTEREST TO JOIN 247DOC.NET
              </Text>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <>
              <InputComponent
                label="Your Full Name"
                keyboardType="default"
                onChangeText={handleChange('name')}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.name}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Email Address"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                value={values.email}
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
                keyboardType="numeric"
                onChangeText={handleChange('phoneNumber')}
                value={values.phoneNumber}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.phoneNumber}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Registration Number"
                keyboardType="default"
                onChangeText={handleChange('regNumber')}
                value={values.regNumber}
              />
              {touched.regNumber && errors.regNumber && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.regNumber}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Registration Country"
                keyboardType="default"
                onChangeText={handleChange('regCountry')}
                value={values.regCountry}
              />
              {touched.regCountry && errors.regCountry && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.regCountry}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Password"
                placeholder="Password"
                keyboardType="default"
                onChangeText={handleChange('password')}
                value={values.password}
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
                value={values.confirmPassword}
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.confirmPassword}
                </Text>
              )}
            </>
            {/* <>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>State</Text>
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
                  boxStyles={{
                    ...styles2.border,
                    justifyContent: 'flex-start',
                    backgroundColor: 'white',
                  }}
                  inputStyles={{ textAlign: 'left' }}
                  setSelected={handleChange('state')}
                  data={states}
                  save="key"
                  placeholder="Select your state"
                  defaultOption={{ key: 'abuja', value: 'Abuja' }}
                />
              )}
              {touched.state && errors.state && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.state}
                </Text>
              )}
            </> */}
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={values.acceptTerm ? 'checked' : 'unchecked'}
                  onPress={() =>
                    setValues({ ...values, acceptTerm: !values.acceptTerm })
                  }
                />

                <Text style={{ color: 'black', fontWeight: '400' }}>
                  I have read and accept the{' '}
                  <Text style={{ color: 'blue' }}>
                    terms of service agreement
                  </Text>
                </Text>
              </View>
            </>
            <MyButton
              loading={isSubmitting}
              text="Register"
              onPress={handleSubmit}
              textColor="white"
              buttonColor={colors.lightGreen}
            />
          </View>
        </ScrollView>
      </Container>
    </View>
  );
};

export default sell;

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
