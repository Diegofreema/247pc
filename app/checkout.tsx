import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../components/Container';
import NavigationHeader from '../components/NavigationHeader';
import {
  ActivityIndicator,
  Button,
  Card,
  TextInput,
  Text,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useGetOrder } from '../lib/queries';
import { colors } from '../constants/Colors';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from '@tanstack/react-query';
type Props = {};
const validationSchema = yup.object().shape({
  coupon: yup.string().required('Coupon code is required'),
});
const CheckOut = (props: Props) => {
  const { id } = useStoreId();
  const { show } = useToast();
  const queryClient = useQueryClient();
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      coupon: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { data } = await axios.post(
        `https://247api.netpro.software/api.aspx?api=addcoupon&myuserid=${id}&couponCode=${values.coupon}`
      );
      if (data === 'Invalid code!') {
        return show('Invalid code!', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });
      }

      if (data === 'Free delivery has been applied!') {
        queryClient.invalidateQueries({ queryKey: ['order'] });
        resetForm();
        return show('Free delivery has been applied', {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    },
  });
  const { data, isPaused, isPending, isFetching, isError } = useGetOrder();
  if (isPaused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
      </View>
    );
  }
  console.log(data);

  return (
    <Container>
      <NavigationHeader back title="Checkout" />
      <View style={{ marginTop: 20 }} />
      <View style={{ marginBottom: 20 }}>
        <TextInput
          disabled={isSubmitting}
          value={values.coupon}
          onChangeText={handleChange('coupon')}
          label="Apply coupon"
          right={
            <TextInput.Icon
              icon="arrow-right"
              size={30}
              color={'black'}
              onPress={() => handleSubmit()}
            />
          }
        />
        {errors.coupon && touched.coupon && (
          <Text style={{ color: 'red' }}>{errors.coupon}</Text>
        )}
      </View>
      <View style={{ marginBottom: 40 }} />
      {isFetching || isPending ? (
        <ActivityIndicator color="black" size={'large'} />
      ) : (
        <Card>
          <Card.Content>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text variant="titleLarge" style={{ color: 'black' }}>
                Order Summary
              </Text>
              <Text variant="titleMedium" style={{ color: 'black' }}>
                {data?.items} item(s)
              </Text>
            </View>
            <View
              style={{
                marginVertical: 25,
                width: '100%',
                height: 1,
                backgroundColor: 'black',
              }}
            />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text variant="titleSmall" style={{ color: 'black' }}>
                Subtotal
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
              >
                {data?.subtotal}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 25,
                width: '100%',
                height: 1,
                backgroundColor: 'black',
              }}
            />
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text variant="titleSmall" style={{ color: 'black' }}>
                Delivery charge
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
              >
                {data?.delivery}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 25,
                width: '100%',
                height: 1,
                backgroundColor: 'black',
              }}
            />
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                variant="titleLarge"
                style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}
              >
                Total
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
              >
                {data?.total}
              </Text>
            </View>
          </Card.Content>

          <Card.Actions
            style={{ flexDirection: 'column', marginTop: 20, gap: 10 }}
          >
            <Button
              icon={'credit-card'}
              buttonColor={colors.lightGreen}
              textColor="white"
              style={{ width: '100%', borderRadius: 5 }}
            >
              Pay with Card
            </Button>
            <Button
              icon={'wallet'}
              textColor="white"
              buttonColor={colors.black}
              style={{ width: '100%', borderRadius: 5 }}
            >
              Pay with Wallet
            </Button>
          </Card.Actions>
        </Card>
      )}
    </Container>
  );
};

export default CheckOut;

const styles = StyleSheet.create({});
