import { FlatList, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useWallet, useWalletBalance } from '../../lib/queries';
import Container from '../../components/Container';
import NavigationHeader from '../../components/NavigationHeader';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator, Button } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { useFormik } from 'formik';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import * as yup from 'yup';
import axios from 'axios';
import { useStoreId } from '../../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import InputComponent from '../../components/InputComponent';
import { MyButton } from '../../components/MyButton';
import { useRouter } from 'expo-router';
import { api } from '../../lib/contants';
import { ErrorComponent } from '../../components/ErrorComponent';
import { goToWebsiteForCheckout } from '../../lib/helpers';

const validationSchema = yup.object().shape({
  amount: yup.string().required('Amount should be at least ₦300'),
});

const Wallet = () => {
  const {
    data,
    refetch,
    isFetching,
    isError,
    isPaused,
    isRefetching,
    isPending,
  } = useWallet();

  const {
    data: walletBalance,
    isFetching: walletBalanceIsFetching,
    isPaused: walletBalanceIsPaused,
    isPending: walletBalanceIsPending,
    isError: walletBalanceIsError,
    refetch: walletBalanceRefetch,
  } = useWalletBalance();
  const paystackWebViewRef = useRef<paystackProps.PayStackRef | null>(null);
  const [reference, setReference] = useState('');

  const { id, user } = useStoreId();

  console.log({ id });
  const { show } = useToast();
  const router = useRouter();
  const {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `${api}=buywalletcredit&myuserid=${id}&amount=${values.amount}`
        );

        if (response.data) {
          setReference(response.data);
          await goToWebsiteForCheckout({
            name: user?.customername!,
            amount: +values.amount!,
            email: user?.email!,
            phoneNumber: user?.phone!,
            reference: response.data,
          });
          // paystackWebViewRef?.current?.startTransaction();
        } else {
          show('Please make sure you buy at least ₦300 worth of credit', {
            type: 'danger',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const [reload, setReload] = useState(false);
  const handleRefetch = () => {
    setReload(!reload);
    refetch();
  };
  if (isPaused || walletBalanceIsPaused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please check your internet connection</Text>
        <MyButton
          buttonColor={colors.lightGreen}
          onPress={handleRefetch}
          text="Retry"
        />
      </View>
    );
  }

  if (isError || walletBalanceIsError) {
    return <ErrorComponent refetch={refetch} />;
  }
  const { amount } = values;

  const finalAmount = parseInt(amount.replace(',', ''));
  const isLoading =
    isPending ||
    walletBalanceIsPending ||
    isFetching ||
    walletBalanceIsFetching;
  return isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={'black'} />
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Container>
        <NavigationHeader title="Wallet" back />
        <View style={{ marginTop: 20 }} />
        <Paystack
          paystackKey={'pk_live_34dcb421bb4e9e6f20fdf2c993f2b44c9e436fbe'}
          billingEmail={user?.email as string}
          amount={finalAmount}
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
          onSuccess={() => {
            axios
              .post(`https://247pharmacy.net/check-out.aspx?zxc=${reference}`)
              .then((response) => console.log(response));

            show('Payment successful', {
              type: 'success',
              placement: 'bottom',
              duration: 4000,
              animationType: 'slide-in',
            });

            setReference('');
            router.push('/order');
            resetForm({ values: { amount: '' } });
            walletBalanceRefetch();
          }}
          refNumber={reference}
          // @ts-ignore
          ref={paystackWebViewRef}
        />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 15,
            }}
          >
            <FontAwesome5 name="wallet" color="black" size={30} />
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: 15,
                color: 'black',
              }}
            >
              My Wallet
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginLeft: 10,
              marginTop: 15,
            }}
          >
            <FontAwesome name="money" size={25} color="#000" />
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins',
                fontSize: 12,
              }}
            >
              Your Balance: ₦{walletBalance}
            </Text>
          </View>

          <View
            style={{
              borderWidth: 3,
              borderColor: colors.lightGreen,
              borderRadius: 6,
            }}
          >
            <View
              style={{
                backgroundColor: colors.lightGreen,
                padding: 10,
                paddingVertical: 20,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'PoppinsMedium',
                  fontSize: 14,
                  color: 'white',
                }}
              >
                Fund Wallet
              </Text>
            </View>
            <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
              <View
                style={{
                  marginBottom: 30,
                  gap: 10,
                }}
              >
                <InputComponent
                  label="Amount"
                  placeholder="Enter Amount..."
                  keyboardType="numeric"
                  onChangeText={handleChange('amount')}
                  value={amount}
                />
              </View>
              {touched.amount && errors.amount && (
                <Text
                  style={{ color: 'red', fontWeight: 'bold', marginTop: 20 }}
                >
                  {errors.amount}
                </Text>
              )}
            </View>
            <Button
              onPress={() => handleSubmit()}
              loading={isSubmitting}
              style={{
                margin: 20,
                borderRadius: 5,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={'card'}
              // buttonColor={colors.lightGreen}
              rippleColor={'white'}
              textColor={colors.lightGreen}
              labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
            >
              Pay with Card
            </Button>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
              marginBottom: 15,
            }}
          >
            <FontAwesome name="calendar" size={24} color="black" />
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: 14,
                color: 'black',
              }}
            >
              Transaction History
            </Text>
          </View>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          data={data}
          renderItem={({ item }) => (
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins',
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {item?.info}
            </Text>
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 20,
                  color: 'black',
                  marginTop: 50,
                }}
              >
                No Transactions
              </Text>
            </View>
          }
        />
      </Container>
    </View>
  );
};

export default Wallet;
