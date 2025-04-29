import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';
import Container from '../../components/Container';
import { ModalComponent } from '../../components/Modal';
import { MyButton } from '../../components/MyButton';
import NavigationHeader from '../../components/NavigationHeader';
import { colors } from '../../constants/Colors';
import { useRefetchFee } from '../../hooks/useRefetchFee';
import { api } from '../../lib/contants';
import { goToWebsiteForCheckout } from '../../lib/helpers';
import { useWallet } from '../../lib/mutation';
import { useGetOrder } from '../../lib/queries';
import { useStoreId } from '../../lib/zustand/auth';

const validationSchema = yup.object().shape({
  coupon: yup.string().required('Coupon code is required'),
});

const CheckOut = () => {
  // const paystackWebViewRef = useRef<paystackProps.PayStackRef | null>(null);
  const { id, user } = useStoreId();
  const isPendingFee = useRefetchFee();
  const router = useRouter();
  const { show } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: onWalletPay, isPending: walletLoading } = useWallet();

  const [paying, setIsPaying] = useState(false);
  // const [salesRef, setSalesRef] = useState('');
  // const [totalCost, setTotalCost] = useState('');

  const { handleChange, handleSubmit, values, errors, touched, isSubmitting } =
    useFormik({
      initialValues: {
        coupon: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        const { data } = await axios.get(
          `${api}=addcoupon&myuserid=${id}&couponCode=${values.coupon}`
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
      const { data } = await axios.get(
        `${api}=cartpaycard&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}&couponCode=${values?.coupon}`
      );

      if (data?.salesref) {
        // setSalesRef(data.salesref);
        // setTotalCost(data?.totalcost);
        // paystackWebViewRef?.current?.startTransaction();
        await goToWebsiteForCheckout({
          name: user?.customername!,
          email: user?.email!,
          phoneNumber: user?.phone!,
          amount: data?.totalcost!,
          reference: data?.salesref!,
        });
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

  const { data, isPaused, isPending, isError, refetch } = useGetOrder();

  useEffect(() => {
    if (isPending || isError) return;
    if (!data?.items) {
      router.replace('/order');
    }
  }, [data?.items, router, isPending, isError]);
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

  // const amount = parseInt(totalCost);

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

      <TouchableOpacity
        onPress={() => router.push('/updateProfile?page=checkout')}
      >
        <Text
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
        </Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 40 }} />
      {isPending || isPendingFee ? (
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
          {/* <Paystack
            paystackKey="pk_live_34dcb421bb4e9e6f20fdf2c993f2b44c9e436fbe"
            billingEmail={user?.email as string}
            amount={amount}
            refNumber={salesRef}
            channels={[
              'card',
              'bank',
              'ussd',
              'mobile_money',
              'qr',
              'bank_transfer',
            ]}
            onCancel={() => {
              show('Payment cancelled', {
                type: 'success',
                placement: 'bottom',
                duration: 4000,
                animationType: 'slide-in',
              });
            }}
            onSuccess={async () => {
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
                await onReview();
                setUser(user);
                queryClient.invalidateQueries({ queryKey: ['user'] });
                router.push('/order');
              } catch (error) {
                console.log(error);

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
          /> */}

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
