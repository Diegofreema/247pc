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
import { useJoinUs } from '../../lib/mutation';
type Props = {};
const validationSchema = yup.object().shape({
  name: yup.string().required('Name of pharmacy is required'),

  email: yup.string().email('Invalid email').required('Email is required'),

  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  state: yup.string().required('State is required'),
});
const { width } = Dimensions.get('window');
const sell = (props: Props) => {
  const [states, setStates] = useState<State[]>([
    { statename: 'abuja', label: 'Abuja' },
    { statename: 'imo', label: 'Imo' },
  ]);
  const { mutateAsync, isPending } = useJoinUs();
  const [loadingStates, setLoadingStates] = useState(false);
  const [error, setError] = useState('');
  const { values, errors, handleChange, handleSubmit, touched, resetForm } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        state: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        const response = await mutateAsync({
          email: values.email,
          pharmacyName: values.name,
          stateName: values.state,
          phoneNumber: values.phoneNumber,
          address: values.address,
        });

        // if (response === 'saved') {
        //   resetForm();
        // }
      },
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
                EXPRESSION OF INTEREST TO JOIN 247PHARMACY
              </Text>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <>
              <InputComponent
                label="Name of Pharmacy"
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
                label="Address"
                keyboardType="default"
                onChangeText={handleChange('address')}
                value={values.address}
              />
              {touched.address && errors.address && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.address}
                </Text>
              )}
            </>
            <>
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

            <MyButton
              loading={isPending}
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
