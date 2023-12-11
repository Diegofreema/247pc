import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { Image } from 'expo-image';
import NavigationHeader from '../../components/NavigationHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import axios from 'axios';
import { State } from '../../lib/types';
import { SelectList } from 'react-native-dropdown-select-list';
import InputComponent from '../../components/InputComponent';
import { MyButton } from '../../components/MyButton';
import { colors } from '../../constants/Colors';
import { Checkbox, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { Link, useRouter } from 'expo-router';
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
    .oneOf([true], 'Accept the terms of service agreement to continue'),
  image: yup.string().required('Profile picture is required'),
});
const { width } = Dimensions.get('window');
const sell = (props: Props) => {
  const [states, setStates] = useState<State[]>([
    { statename: 'abuja', label: 'Abuja' },
    { statename: 'imo', label: 'Imo' },
  ]);

  const { show } = useToast();
  const router = useRouter();

  const [cameraPermissionInformation, requestPermission] =
    ImagePicker.useCameraPermissions();
  const verifyPermissions = async () => {
    if (
      cameraPermissionInformation?.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (
      cameraPermissionInformation?.status ===
      ImagePicker.PermissionStatus.DENIED
    ) {
      show('Permission to access camera was denied', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
      return false;
    }
    return true;
  };

  const handlePress = async () => {
    const supported = await Linking.canOpenURL(
      'https://247pharmacy.net/TERMS_OF_SERVICE_AGREEMENT_BETWEEN_NETPRO_AND_HEALTH_CARE_SERVICE_PROVIDERS_v04.10.23.pdf'
    );

    if (supported) {
      await Linking.openURL(
        'https://247pharmacy.net/TERMS_OF_SERVICE_AGREEMENT_BETWEEN_NETPRO_AND_HEALTH_CARE_SERVICE_PROVIDERS_v04.10.23.pdf'
      );
    } else {
      console.log(
        `Don't know how to open this URL: ${'https://247pharmacy.net/TERMS_OF_SERVICE_AGREEMENT_BETWEEN_NETPRO_AND_HEALTH_CARE_SERVICE_PROVIDERS_v04.10.23.pdf'}`
      );
    }
  };

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
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {},
  });
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setValues({
        ...values,
        image: result.assets[0].uri,
      });
    }
  };
  const takeImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!image.canceled) {
      setValues({
        ...values,
        image: image.assets[0].uri,
      });
    }
  };
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
              <Text
                style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }}
              >
                Brief Bio
              </Text>
              <TextInput
                multiline
                numberOfLines={5}
                value={values.bio}
                onChangeText={handleChange('bio')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black',
                  flex: 1,
                  paddingTop: 15,
                  paddingLeft: 5,
                }}
                contentStyle={{
                  backgroundColor: 'transparent',
                  color: 'black',
                }}
                placeholderTextColor={'black'}
                textColor="black"
                activeOutlineColor="black"
                outlineStyle={{ borderColor: 'black', borderWidth: 1 }}
                mode="outlined"
              />
            </>
            <>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',

                  textAlign: 'left',
                }}
              >
                Profile Picture
              </Text>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {values.image ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderRadius: 50,
                      width: 100,
                      height: 100,
                      borderColor: colors.lightGreen,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={{ uri: values.image }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      contentFit="cover"
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderRadius: 50,
                      width: 100,
                      height: 100,
                      borderColor: colors.lightGreen,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={require('../../assets/images/placeholder.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      contentFit="cover"
                    />
                  </View>
                )}
                <View style={{ gap: 10, marginTop: 10, flexDirection: 'row' }}>
                  <MyButton
                    style={{ flex: 1 }}
                    text="Pick an image"
                    buttonColor={colors.lightGreen}
                    textColor="white"
                    onPress={pickImage}
                  />
                  <MyButton
                    style={{ flex: 1 }}
                    text="Take a selfie"
                    textColor="white"
                    buttonColor={colors.lightGreen}
                    onPress={takeImage}
                  />
                </View>
              </View>
              {touched.image && errors.image && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.image}
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
                  <Text
                    style={{ color: 'blue' }}
                    onPress={() => router.push('/terms')}
                  >
                    terms of service agreement
                  </Text>
                </Text>
              </View>
              {touched.acceptTerm && errors.acceptTerm && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.acceptTerm}
                </Text>
              )}
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
