import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableText,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";
import { colorPrimary } from "src/constants/colors.constants";
import { useAppTheme } from "src/providers/theme.provider";
import OtpInput from "src/components/otpinputs.components";
import useAuth from "src/hooks/apis/useAuth";
import { Toast } from "toastify-react-native";

export default function OTPVerificationScreen({
  navigation,
  route,
}: RootStackScreenProps<"OTPVerificationScreen">) {
  const { theme } = useAppTheme();
  const email = route.params?.email || "";
  const mobile = route.params?.mobile || "";
  const isEmail = route.params?.isEmail ?? true;
  const isPasswordReset = route.params?.isPasswordReset ?? false;
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(0);
  const [verifyError, setVerifyError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  const { loading, requestOTP, verifyOTP } = useAuth();

  const startCount = (seconds: number) => {
    let x = setInterval(function () {
      seconds = seconds - 1;
      if (seconds <= 0) {
        clearInterval(x);
      }
      setCounter(seconds);
    }, 1000);
  };

  const doRequestNewOTP = async () => {
    await requestOTP({
      email: isEmail ? email : undefined,
      mobile: !isEmail ? mobile : undefined,
      ispasswordreset: isPasswordReset,
    });
    startCount(60);
  };

  const doVerify = async () => {
    const req = await verifyOTP({
      otp,
      email: isEmail ? email : undefined,
      mobile: !isEmail ? mobile : undefined,
    });

    if (req.code === 200) {
      // OTP verification successful
      setVerifyError("");
      setAttemptCount(0);
      navigation.navigate(
        isPasswordReset
          ? "ResetPasswordScreen"
          : "AccountSuccessScreen",
      );
    } else {
      // Handle different error scenarios
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      let errorMessage = "";
      
      switch (req.code) {
        case 400:
          errorMessage = "Invalid OTP. Please check and try again.";
          break;
        case 401:
          errorMessage = "Invalid or expired OTP. Please request a new one.";
          break;
        case 429:
          errorMessage = "Too many incorrect attempts. Please try again later.";
          break;
        case 410:
          errorMessage = "OTP has expired. Please request a new one.";
          break;
        default:
          errorMessage = req.message || "OTP verification failed. Please try again.";
      }

      setVerifyError(errorMessage);
      setOtp(""); // Reset OTP input on error

      Toast.show({
        type: "error",
        text1: "OTP Verification Failed",
        text2: errorMessage,
      });

      // Lock input after 3 failed attempts
      if (newAttemptCount >= 3) {
        Toast.show({
          type: "error",
          text1: "Too Many Attempts",
          text2: "Please request a new OTP code.",
        });
      }
    }
  };

  useEffect(() => {
    // Start the countdown timer for "Resend" button
    // OTP was already sent before navigating to this screen
    startCount(60);
  }, []);

  useEffect(() => {
    if (otp.length === 4 && attemptCount < 3) doVerify();
  }, [otp]);

  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require("src/assets/images/phone-finger-verification.png")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(20)}
        mb={fontUtils.h(5)}
        size={fontUtils.h(18)}
      >
        OTP Verification
      </Text>
      <Text mb={fontUtils.h(30)}>
        {`An OTP code has been sent to your email ${
          email ? email : mobile
        } Kindly input it
        in the fields below`}
      </Text>
      <OtpInput value={otp} onChange={setOtp} />
      {verifyError && (
        <Text
          color="red"
          ml={fontUtils.w(8)}
          mt={fontUtils.h(12)}
          mb={fontUtils.h(12)}
          size={fontUtils.h(12)}
        >
          {verifyError} {attemptCount > 0 && `(Attempt ${attemptCount}/3)`}
        </Text>
      )}
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyCenter,
          {
            marginTop: fontUtils.h(50),
            marginBottom: fontUtils.h(60),
          },
        ]}
      >
        <Text>
          {counter > 0
            ? `Request new code in ${counter}s`
            : attemptCount >= 3
            ? `Too many attempts. Request a new code below.`
            : `Click here if you didn't receive any OTP?`}
        </Text>
        {counter < 1 && attemptCount < 3 ? (
          <TouchableText
            color={colorPrimary}
            fontFamily={fontUtils.manrope_semibold}
            onPress={doRequestNewOTP}
          >
            Resend
          </TouchableText>
        ) : attemptCount >= 3 && counter === 0 ? (
          <TouchableText
            color={colorPrimary}
            fontFamily={fontUtils.manrope_semibold}
            onPress={() => {
              setAttemptCount(0);
              setVerifyError("");
              setOtp("");
              doRequestNewOTP();
            }}
          >
            Request New Code
          </TouchableText>
        ) : null}
      </View>
      <Button
        title="Confirm"
        onPress={doVerify}
        loading={loading}
        disabled={otp.length < 4 || attemptCount >= 3}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(25)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerStyle: {
    width: fontUtils.w(276 * 0.9),
    height: fontUtils.w(255 * 0.9),
    alignSelf: "center",
  },
});
