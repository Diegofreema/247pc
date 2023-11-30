import { Text, View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';

import AuthHeader from '../components/AuthHeader';

import Container from '../components/Container';
import InputComponent from '../components/InputComponent';
import { ActivityIndicator, Button } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

import { useCommunities, useStates } from '../lib/queries';
import RNPickerSelect from 'react-native-picker-select';

import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import { MyButton } from '../components/MyButton';
import { getProfile } from '../lib/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { Community, State } from '../lib/types';
import { SelectList } from 'react-native-dropdown-select-list';

type Props = {};
const width = Dimensions.get('window').width;

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),

  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  state: yup.string().required('State is required'),

  communityId: yup.string().required('Community is required'),
});
const Update = (props: Props) => {
  const { setId, id, getId, getUser, removeUser } = useStoreId();
  const queryClient = useQueryClient();

  const [states, setStates] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [gettingUser, setGettingUser] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

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
      email: '',

      name: '',
      state: 'abuja',
      address: '',
      phoneNumber: '',

      communityId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const response = await axios.post(
        `https://247api.netpro.software/api.aspx?api=accountupdate&statename=${values.state}&fullname=${values.name}&phone=${values.phoneNumber}&addres=${values.address}&emailaddress=${values.email}&communityId=${values.communityId}&myuserid=${id}`
      );

      if (response.data === 'saved') {
        toast.show('Your profile has been updated successfully,', {
          type: 'success ',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });

        queryClient.invalidateQueries({ queryKey: ['user'] });
        router.back();
      } else if (
        response.data ===
        'you may not change infor while a delivery is en route'
      ) {
        toast.show('You may not change info while a delivery is en route', {
          type: 'danger ',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });

        return;
      }
    },
  });
  const { address, email, name, phoneNumber, state } = values;

  useEffect(() => {
    const getUser = async () => {
      setGettingUser(true);
      try {
        getId();
        const { data } = await axios.get(
          `https://247api.netpro.software/api.aspx?api=userinfo&myuserid=${id}`
        );
        setValues({
          address: data?.addres,
          state: data?.statename,
          email: data?.email,
          name: data?.customername,
          phoneNumber: data?.phone,
          communityId: data?.communityId,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setGettingUser(false);
      }
    };
    getUser();
  }, []);
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
        console.log(error);
        setError('Something went wrong, try again later');
        setLoadingStates(false);
      });
  }, []);

  useEffect(() => {
    setLoadingCommunities(true);
    axios
      .get(
        `https://247api.netpro.software/api.aspx?api=communities&statename=${state}`
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
  }, [state]);
  const router = useRouter();

  if (error.trim() !== '') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>
          {error}
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        <AuthHeader />

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: width, height: 150 }}
          />
          <View style={{ marginVertical: 30 }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
              Profile Update
            </Text>
          </View>
        </View>
        {gettingUser ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <Container>
            <View style={{ gap: 10 }}>
              <>
                <InputComponent
                  label="Your Name"
                  placeholder="Your name"
                  keyboardType="default"
                  onChangeText={handleChange('name')}
                  value={name}
                />
                {touched.name && errors.name && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.name}
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
                        marginBottom: 10,
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
                    save="value"
                    placeholder="Select your state"
                    defaultOption={{
                      key: state,
                      value: state,
                    }}
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
                        marginBottom: 10,
                      }}
                    >
                      <Text>Loading...</Text>
                    </View>
                  </View>
                ) : (
                  <SelectList
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

              <MyButton
                loading={isSubmitting}
                style={{ marginTop: 20, borderRadius: 5 }}
                disabled={isSubmitting}
                buttonColor={colors.lightGreen}
                onPress={() => handleSubmit()}
                text="Update"
                textColor={isSubmitting ? 'black' : 'white'}
              />
            </View>
          </Container>
        )}
      </ScrollView>
    </View>
  );
};

export default Update;
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
