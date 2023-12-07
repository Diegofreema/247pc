import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import { useWallet, useWalletBalance } from '../lib/queries';
import Container from '../components/Container';
import NavigationHeader from '../components/NavigationHeader';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useFormik } from 'formik';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import * as yup from 'yup';
import axios from 'axios';
import { useStoreId } from '../lib/zustand/auth';
import { useToast } from 'react-native-toast-notifications';
import InputComponent from '../components/InputComponent';
type Props = {};
const validationSchema = yup.object().shape({
  amount: yup.string().required('Amount is required'),
});
const Wallet = (props: Props) => {
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
  } = useWalletBalance();
  const paystackWebViewRef = useRef<paystackProps.PayStackRef | null>(null);
  const [reference, setReference] = useState('');
  const { id, user } = useStoreId();
  const { show } = useToast();
  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    touched,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    onSubmit: (values) => {
      axios
        .post(
          `https://247api.netpro.software/api.aspx?api=buywalletcredit&myuserid=${id}&amount=${values.amount}`
        )
        .then((res) => {
          if (res.data) {
            setReference(res?.data);
          } else {
            show('Something went wrong', {
              type: 'danger',
              placement: 'bottom',
              duration: 4000,
              animationType: 'slide-in',
            });
            return;
          }
        })
        .then(() => {
          paystackWebViewRef.current?.startTransaction();
        });
    },
  });

  if (isPaused || walletBalanceIsPaused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  if (isError || walletBalanceIsError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
          Something went wrong
        </Text>
      </View>
    );
  }
  const { amount } = values;

  const finalAmount = parseInt(amount.replace(',', '')) * 100;
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
    <Container>
      <NavigationHeader title="Wallet" back />
      <View style={{ marginTop: 20 }} />
      <Paystack
        paystackKey="pk_live_616edbbc0c4a079dd0d866045da2a1f765386f43"
        billingEmail={user?.email as string}
        amount={finalAmount}
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
            .post(`https://247pharmacy.net/check-out.aspx?zxc=${reference}`)
            .then((response) => console.log(response));

          show('Payment successful', {
            type: 'success',
            placement: 'bottom',
            duration: 4000,
            animationType: 'slide-in',
          });
          setReference('');
          resetForm({ values: { amount: '' } });
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
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
          <FontAwesome name="money" size={25} color="#fff" />
          <Text style={{ color: 'white' }}>Your Balance: ₦{walletBalance}</Text>
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
            <Text style={{ fontSize: 15, fontWeight: '500', color: 'white' }}>
              Fund Wallet
            </Text>
          </View>
          <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
            <InputComponent
              label="Amount"
              placeholder="Enter Amount"
              keyboardType="numeric"
              onChangeText={handleChange('amount')}
              value={amount}
            />
            {touched.amount && errors.amount && (
              <Text style={{ color: 'red', marginTop: 10 }}>
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
            buttonColor={colors.lightGreen}
            textColor="white"
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
          }}
        >
          <FontAwesome name="calendar" size={24} color="black" />
          <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>
            Transaction History
          </Text>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item}
        data={data}
        renderItem={({ item }) => (
          <Text style={{ color: 'black', fontWeight: '500', marginBottom: 10 }}>
            {item?.info}
          </Text>
        )}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={() => (
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
        )}
      />
    </Container>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
