import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import {
  ActivityIndicator,
  Button,
  Card,
  TextInput,
  Text,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useGetOrder } from '../../lib/queries';
import { colors } from '../../constants/Colors';
import axios from 'axios';
import { useStoreId } from '../../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { usePayStack, useWallet } from '../../lib/mutation';
import { ModalComponent } from '../../components/Modal';
import { useModalState } from '../../lib/zustand/modalState';
import { MyButton } from '../../components/MyButton';
import { Link, router } from 'expo-router';
import { getProfile } from '../../lib/helpers';
type Props = {};
const validationSchema = yup.object().shape({
  coupon: yup.string().required('Coupon code is required'),
});

const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_KEY!;
const api = process.env.EXPO_PUBLIC_API_URL;
const CheckOut = (props: Props) => {
  const paystackWebViewRef = useRef<paystackProps.PayStackRef | null>(null);
  const { id, user, setUser } = useStoreId();
  const { show } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: onWalletPay, isPending: walletLoading } = useWallet();

  const [paying, setIsPaying] = useState(false);
  const [salesRef, setSalesRef] = useState('');
  const [totalCost, setTotalCost] = useState('');

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
  const payWithCard = async () => {
    setIsPaying(true);
    try {
      const { data } = await axios.post(
        `${api}?api=cartpaycard&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}&couponCode=${values?.coupon}`
      );
      console.log(data);

      if (data?.salesref) {
        setSalesRef(data.salesref);
        setTotalCost(data?.totalcost);
        paystackWebViewRef?.current?.startTransaction();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPaying(false);
    }
  };
  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };

  const {
    data,
    isPaused,
    isPending,
    isFetching,
    isError,
    isLoading: loadingOrder,
    refetch,
  } = useGetOrder();

  if (isPaused) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }

  const amount = parseInt(totalCost);

  return (
    <Container>
      <ModalComponent />
      <NavigationHeader back title="Checkout" />
      <View style={{ marginTop: 20 }} />
      <View style={{ marginBottom: 20 }}>
        <TextInput
          mode="outlined"
          style={{ backgroundColor: 'transparent', color: 'black' }}
          contentStyle={{
            backgroundColor: 'transparent',
            color: 'black',
            fontFamily: 'Poppins',
            fontSize: 13,
          }}
          placeholderTextColor={'black'}
          textColor="black"
          activeOutlineColor="black"
          outlineStyle={{ borderColor: 'black', borderWidth: 1 }}
          disabled={isSubmitting}
          value={values.coupon}
          onChangeText={handleChange('coupon')}
          placeholder="Enter coupon code"
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

      <Link
        href="/updateProfile"
        style={{
          fontFamily: 'Poppins',
          fontSize: 12,
          color: 'skyblue',
          textDecorationStyle: 'solid',
          alignItems: 'center',
          textDecorationLine: 'underline',
        }}
      >
        Change delivery address
      </Link>
      <View style={{ marginBottom: 40 }} />
      {isPending ? (
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
            paystackKey={paystackKey}
            billingEmail={user?.email as string}
            amount={amount}
            refNumber={salesRef}
            channels={['card']}
            onCancel={(e) => {
              show('Payment cancelled', {
                type: 'success',
                placement: 'bottom',
                duration: 4000,
                animationType: 'slide-in',
              });
            }}
            onSuccess={async ({ transactionRef }) => {
              // @ts-ignore

              try {
                await axios.post(
                  `https://247pharmacy.net/checkout.aspx?zxc=${salesRef}`
                );
                alert('Payment successful');
                show('Payment successful', {
                  type: 'success',
                  placement: 'bottom',
                  duration: 4000,
                  animationType: 'slide-in',
                });
                const user = await getProfile(id);
                setUser(user);
                queryClient.invalidateQueries({ queryKey: ['user'] });
                router.push('/order');
              } catch (error) {
                show('Something went wrong', {
                  type: 'error',
                  placement: 'bottom',
                  duration: 4000,
                  animationType: 'slide-in',
                });
              }
            }}
            // @ts-ignore
            ref={paystackWebViewRef}
          />

          <Card.Content>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                variant="titleLarge"
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontFamily: 'PoppinsBold',
                }}
              >
                Order Summary
              </Text>
              <Text
                variant="titleMedium"
                style={{
                  color: 'black',
                  fontSize: 12,
                  fontFamily: 'PoppinsMedium',
                }}
              >
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
              <Text
                variant="titleSmall"
                style={{
                  color: 'black',
                  fontFamily: 'PoppinsMedium',
                  fontSize: 12,
                }}
              >
                Subtotal
              </Text>
              <Text
                variant="titleMedium"
                style={{
                  color: 'black',
                  fontSize: 15,
                  fontFamily: 'PoppinsMedium',
                }}
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
              <Text
                variant="titleSmall"
                style={{
                  color: 'black',
                  fontFamily: 'PoppinsMedium',
                  fontSize: 12,
                }}
              >
                Delivery charge
              </Text>
              <Text
                variant="titleMedium"
                style={{
                  color: 'black',
                  fontFamily: 'PoppinsMedium',
                  fontSize: 15,
                }}
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
                style={{
                  color: 'black',
                  fontFamily: 'PoppinsBold',
                  fontSize: 16,
                }}
              >
                Total
              </Text>
              <Text
                variant="titleMedium"
                style={{
                  color: 'black',
                  fontFamily: 'PoppinsBold',
                  fontSize: 16,
                }}
              >
                {data?.total}
              </Text>
            </View>
          </Card.Content>

          <Card.Actions
            style={{ flexDirection: 'column', marginTop: 20, gap: 10 }}
          >
            <Button
              onPress={payWithCard}
              loading={paying}
              icon={'credit-card'}
              buttonColor={colors.lightGreen}
              textColor="white"
              style={{ width: '100%', borderRadius: 5 }}
              labelStyle={{ fontSize: 12, fontFamily: 'PoppinsMedium' }}
            >
              Pay with Card
            </Button>
            <Button
              loading={walletLoading}
              onPress={() =>
                onWalletPay({
                  productInCart: data?.items,
                  couponCode: values?.coupon,
                })
              }
              icon={'wallet'}
              textColor="white"
              buttonColor={colors.black}
              style={{ width: '100%', borderRadius: 5 }}
              labelStyle={{ fontSize: 12, fontFamily: 'PoppinsMedium' }}
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
