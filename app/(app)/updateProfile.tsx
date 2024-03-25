import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';

import AuthHeader from '../../components/AuthHeader';

import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useStoreId } from '../../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import { MyButton } from '../../components/MyButton';
import { getProfile } from '../../lib/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { SelectList } from 'react-native-dropdown-select-list';
import { ErrorComponent } from '../../components/ErrorComponent';
import { useGetCom, useGetState, useGetUpdateUser } from '../../lib/queries';

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
  const {
    setId,
    id,
    getId,
    getUser,
    removeUser,
    setUser,
    user: profile,
  } = useStoreId();
  const queryClient = useQueryClient();

  const toast = useToast();
  const [reload, setReload] = useState(false);
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=accountupdate&statename=${values.state}&fullname=${values.name}&phone=${values.phoneNumber}&addres=${values.address}&emailaddress=${values.email}&communityId=${values.communityId}&myuserid=${id}`
      );

      if (response.data === 'saved') {
        toast.show('Your profile has been updated successfully,', {
          type: 'success ',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });
        const user = await getProfile(id);
        setUser(user);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        router.back();
      } else if (
        response.data === 'you may not change info while a delivery is en route'
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
  console.log(values);

  const { address, email, name, phoneNumber, state, communityId } = values;
  useEffect(() => {
    getId();
  }, []);

  const { data, isError, isPending, isPaused, refetch } = useGetUpdateUser(id);
  useEffect(() => {
    setValues({
      address: data?.addres,
      state: data?.statename,
      email: data?.email,
      name: data?.customername,
      phoneNumber: data?.phone,
      communityId: data?.communityId,
    });
  }, [data]);
  const {
    data: states,
    isError: isErrorState,
    isPending: isPendingState,
    refetch: refetchState,
    isPaused: isPausedState,
  } = useGetState();

  const {
    data: communities,
    isError: isErrorCom,
    isPending: isPendingCom,
    refetch: refetchCom,
    isPaused: isPausedCom,
  } = useGetCom(state);
  // useEffect(() => {
  //   setLoadingCommunities(true);
  //   axios
  //     .get(`247pharmacy.net/api.aspx?api=communities&statename=${state}`)
  //     .then(({ data }) => {
  //       let newArray: Community[] = data?.map(
  //         (item: { communityname: string; id: string }) => {
  //           return {
  //             key: item.id,
  //             value: item.communityname,
  //           };
  //         }
  //       );
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // setError(true);
  //     })
  //     .finally(() => {
  //       setLoadingCommunities(false);
  //     });
  // }, [state]);
  const router = useRouter();
  const handleRefetch = () => {
    refetch();
    refetchState();
    refetchCom();
    setReload(!reload);
  };
  if (
    isError ||
    isErrorState ||
    isErrorCom ||
    isPaused ||
    isPausedState ||
    isPausedCom
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (!id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const community = communities?.find((item) => item?.key === communityId);
  console.log('🚀 ~ Update ~ communities:', communities);
  console.log('🚀 ~ Update ~ communityId:', communityId);
  console.log('🚀 ~ Update ~ community:', community);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
          <View style={{ marginVertical: 30 }}>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20 }}>
              Profile Update
            </Text>
          </View>
        </View>

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
              {isPendingState ? (
                <View style={styles2.border}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 15,
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontFamily: 'Poppins' }}>Loading...</Text>
                  </View>
                </View>
              ) : (
                <SelectList
                  search={false}
                  fontFamily="Poppins"
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
              {isPendingCom ? (
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
                  defaultOption={{
                    key: communityId,
                    value: community?.value,
                  }}
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
              buttonColor={colors.lightGreen}
              onPress={() => handleSubmit()}
              text="Update"
              textColor={'white'}
            />
          </View>
        </Container>
      </KeyboardAwareScrollView>
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
