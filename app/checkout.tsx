import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { usePayStack, useWallet } from '../lib/mutation';
type Props = {};
const validationSchema = yup.object().shape({
  coupon: yup.string().required('Coupon code is required'),
});
const CheckOut = (props: Props) => {
  const paystackWebViewRef = useRef<paystackProps.PayStackRef | null>(null);
  const { id, user } = useStoreId();
  const { show } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: walletPay, isPending: walletLoading } = useWallet();
  const { mutateAsync, isPending: loading, data: paystackData } = usePayStack();
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

        return show('Free delivery has been applied', {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    },
  });
  useEffect(() => {
    if (paystackData) {
      paystackWebViewRef?.current?.startTransaction();
    }
  }, [paystackData]);
  const {
    data,
    isPaused,
    isPending,
    isFetching,
    isError,
    isLoading: loadingOrder,
  } = useGetOrder();
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

  const amount = parseInt(data?.total.replace(',', '') as string);

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
        <Card
          contentStyle={{
            padding: 5,
            backgroundColor: 'white',
            elevation: 0,
            shadowColor: 'transparent',
          }}
        >
          <Paystack
            paystackKey="pk_live_616edbbc0c4a079dd0d866045da2a1f765386f43"
            billingEmail={user?.email as string}
            amount={amount}
            channels={['card']}
            onCancel={(e) => {
              show('Payment cancelled', {
                type: 'success',
                placement: 'bottom',
                duration: 4000,
                animationType: 'slide-in',
              });
            }}
            onSuccess={(res) => {
              axios
                .post(
                  `https://247pharmacy.net/checkout.aspx?zxc=${paystackData?.salesref}`
                )
                .then((response) => console.log(response));

              show('Payment successful', {
                type: 'success',
                placement: 'bottom',
                duration: 4000,
                animationType: 'slide-in',
              });
            }}
            refNumber={paystackData?.salesref}
            // @ts-ignore
            ref={paystackWebViewRef}
          />
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
              onPress={() =>
                mutateAsync({
                  couponCode: values?.coupon,
                  productInCart: data?.items,
                })
              }
              loading={loading}
              icon={'credit-card'}
              buttonColor={colors.lightGreen}
              textColor="white"
              style={{ width: '100%', borderRadius: 5 }}
            >
              Pay with Card
            </Button>
            <Button
              disabled={walletLoading}
              onPress={() =>
                walletPay({
                  productInCart: data?.items,
                  couponCode: values?.coupon,
                })
              }
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
