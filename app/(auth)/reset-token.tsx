import {Image} from 'expo-image';
import React, {useEffect, useRef, useState} from 'react';
import {OtpInput, OtpInputRef} from 'react-native-otp-entry';
import {Dimensions, ScrollView, StyleSheet, Text, useWindowDimensions, View,} from 'react-native';
import AuthHeader from '../../components/AuthHeader';
import Container from '../../components/Container';
import {MyButton} from '../../components/MyButton';
import {colors} from '../../constants/Colors';
import {useToast} from 'react-native-toast-notifications';
import axios from 'axios';
import {api} from '../../lib/contants';
import {generateFiveRandomNumber} from '../../lib/helpers';
import {router, useLocalSearchParams} from 'expo-router';

const { width } = Dimensions.get('window');
const size = width / 5 - 20;
const ResetToken = () => {
  const [value, setValue] = useState('');
  const { email, id, token } = useLocalSearchParams<{
    email: string;
    id: string;
    token: string;
  }>();
  const [localToken, setLocalToken] = useState(token);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { width } = useWindowDimensions();
  const toast = useToast();
  const otpRef = useRef<OtpInputRef | null>(null);

  const submitToken = async () => {
    if (localToken !== value) {
      toast.show('Token does not match, please try again', {
        type: 'success ',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
      otpRef.current?.clear();
      setValue('');
      return;
    }
    toast.show('Success', {
      type: 'success ',
      placement: 'bottom',
      duration: 4000,
      animationType: 'slide-in',
    });
    otpRef.current?.clear();
    setValue('');

    router.replace(`/reset-password?id=${id}`);
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResendToken = async () => {
    if (!email) {
      toast.show('Missing email', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
      router.back();
      return;
    }
    setCountdown(60);
    setCanResend(false);
    const tok = generateFiveRandomNumber();
    setLocalToken(tok);

    try {
      const response = await axios.post(
        `${api}=reset247pharmacypassword&emailaddress=${email}&passcode=${tok}`
      );
      if (response.data === 'invalid email') {
        toast.show('Email does not exist', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,

          animationType: 'slide-in',
        });
        return;
      }
      if (response.data) {
        toast.show('New token has been sent to your email', {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    } catch (error) {
      console.log(error);

      toast.show('Failed to send token', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,

        animationType: 'slide-in',
      });
    }
  };
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader />

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: width * 0.6, height: 100 }}
            contentFit="cover"
          />
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, fontFamily: 'PoppinsBold' }}>
              Enter token
            </Text>
          </View>
        </View>
        <Container style={{ marginTop: 30 }}>
          <OtpInput
            ref={otpRef}
            numberOfDigits={5}
            focusColor="green"
            autoFocus
            hideStick={false}
            placeholder="******"
            blurOnFilled={true}
            type="numeric"
            secureTextEntry
            focusStickBlinkingDuration={500}
            onFocus={() => console.log('Focused')}
            onBlur={() => console.log('Blurred')}
            onTextChange={(text) => setValue(text)}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            textInputProps={{
              accessibilityLabel: 'One-Time Token',
            }}
            theme={{
              containerStyle: styles.container,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
              placeholderTextStyle: styles.placeholderText,
              filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
            }}
          />
          <Text
            onPress={handleResendToken}
            disabled={!canResend}
            style={{
              fontFamily: 'Poppins',
              color: canResend ? colors.lightGreen : 'gray',
              textAlign: 'right',
            }}
          >
            {canResend ? 'Resend Token' : `Resend in ${countdown}s`}
          </Text>
          <MyButton
            text="Submit"
            onPress={submitToken}
            buttonColor={colors.lightGreen}
            textColor="white"
            disabled={value.length < 5}
            style={{ marginTop: 15 }}
          />
        </Container>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  pinCodeContainer: {
    borderRadius: 100,
    height: size,
    width: size,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeText: {},
  focusStick: {},
  activePinCodeContainer: {},
  placeholderText: {},
  filledPinCodeContainer: {},
  disabledPinCodeContainer: {},
});
export default ResetToken;
