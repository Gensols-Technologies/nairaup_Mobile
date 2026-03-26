import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  Icon,
  Image,
  ScrollView,
  Text,
  TouchableText,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";
import colorsConstants, { colorPrimary } from "src/constants/colors.constants";
import { Line } from "src/components/line.components";
import { Input } from "src/components/inputs.components";
import { useAppTheme } from "src/providers/theme.provider";
import useAuth from "src/hooks/apis/useAuth";
import { APP_EXPO_PUSH_TOKEN } from "src/constants/app.constants";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import { Toast } from "toastify-react-native";
import IsEmail from "src/utils/isemail.utils";
import { OpenPrivacy, OpenTandC } from "src/utils/app.utils";
import { useGoogle } from "src/hooks/apis/useGoogle";
import { ActivityIndicator } from "react-native";

export default function CreateAccountScreen({
  navigation,
  route,
}: RootStackScreenProps<"CreateAccountScreen">) {
  const { theme } = useAppTheme();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTc, setAcceptedTc] = useState(false);
  const { loading, signUp, requestOTP } = useAuth();
  const { loading: loadingGoogle, signInWithGoogle } = useGoogle();

  const disableSignup = useMemo(() => {
    return (
      username === "" ||
      password === "" ||
      confirmPassword === "" ||
      fullname === ""
    );
  }, [username, password, fullname, confirmPassword]);

  const doGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const doProceed = async () => {
    let error = "";
    let pushnotificationtoken =
      (await SecureStoreManager.getItemFromSecureStore(
        `${APP_EXPO_PUSH_TOKEN}`,
      )) || "";

    // Validate push token - if it's an error message, use empty string
    if (pushnotificationtoken.includes("Error") || pushnotificationtoken.includes("not initialized")) {
      pushnotificationtoken = "";
    }

    const names = fullname.split(" ");
    if (names.length < 2) error = "You must specify your first and last names";
    else if (password !== confirmPassword) error = "Password mismatch";

    if (error?.length > 0)
      return Toast.show({
        type: "info",
        text1: "Sign Up",
        text2: error,
      });

    const isEmail = IsEmail(username);
    const signupReq = await signUp({
      firstname: names[0],
      lastname: names[1],
      ...(isEmail && { email: username }),
      ...(!isEmail && { mobile: username }),
      pushnotificationtoken,
      password,
    });

    // If signup successful, request OTP
    if (signupReq.code === 201) {
      const otpReq = await requestOTP({
        ...(isEmail && { email: username }),
        ...(!isEmail && { mobile: username }),
        ispasswordreset: false,
      });

      // Navigate to OTP verification screen
      if (otpReq.code === 200 || otpReq.code === 201 || signupReq.code === 201) {
        navigation.navigate("OTPVerificationScreen", {
          isEmail,
          mobile: !isEmail ? username : undefined,
          email: isEmail ? username : undefined,
          isPasswordReset: false,
        });
      }
    }
  };

  return (
    <ScrollView style={[styles.container]} withKeyboard>
      <Image
        source={require("src/assets/images/login-banner.jpg")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(20)}
        mb={fontUtils.h(30)}
        size={fontUtils.h(18)}
      >
        Sign Up
      </Text>
      <Input
        label="Enter Name"
        labelIcon={
          <Ionicons
            name="person-outline"
            size={fontUtils.h(20)}
            color="black"
          />
        }
        value={fullname}
        onChangeText={setFullname}
      />
      <Input
        label="Enter Email"
        labelIcon={
          <SimpleLineIcons
            name="envelope"
            size={fontUtils.h(18)}
            color="black"
          />
        }
        keyboardType="email-address"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        label="Create Password"
        labelIcon={
          <SimpleLineIcons name="lock" size={fontUtils.h(18)} color="black" />
        }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        label="Confirm Password"
        labelIcon={
          <SimpleLineIcons name="lock" size={fontUtils.h(18)} color="black" />
        }
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <View style={[layoutConstants.styles.rowView]}>
        <Icon
          type="ionicon"
          name={acceptedTc ? "radio-button-on" : "radio-button-off"}
          size={fontUtils.h(18)}
          color={colorPrimary}
          onPress={() => setAcceptedTc(!acceptedTc)}
        />
        <Text
          color={undefined}
          ml={fontUtils.w(8)}
          lineHeight={fontUtils.h(17)}
          disabled
        >
          By continuing, you agree to our{" "}
          <Text
            color={colorPrimary}
            fontFamily={fontUtils.manrope_medium}
            suppressHighlighting
            onPress={OpenTandC}
          >
            Terms & Conditions
          </Text>
          <Text> and </Text>
          <Text
            color={colorPrimary}
            fontFamily={fontUtils.manrope_medium}
            suppressHighlighting
            onPress={OpenPrivacy}
          >
            Privacy Policy,{" "}
          </Text>
          where applicable, and confirm that you are at least 18 years old.
        </Text>
      </View>
      <Button
        title="Proceed to OTP Verification"
        onPress={doProceed}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(15)}
        disabled={disableSignup || !acceptedTc}
        loading={loading}
      />
      <View style={[layoutConstants.styles.rowView]}>
        <Line flex={1} />
        <Text ml={fontUtils.w(5)} mr={fontUtils.w(5)}>{`Or`}</Text>
        <Line flex={1} />
      </View>
      {Platform.OS === "android" ? (
        <Button
          title="Sign Up with Google"
          onPress={doGoogleLogin}
          loading={loadingGoogle}
          titleStyle={{
            color: colorsConstants[theme].text,
            fontSize: fontUtils.h(12),
          }}
          icon={
            <Image
              source={require("src/assets/images/icons/google-icon.svg")}
              style={styles.btnIconStyle}
            />
          }
          mt={fontUtils.h(20)}
          mb={fontUtils.h(40)}
          type="outline"
        />
      ) : (
        <Button
          title="Continue without account"
          onPress={() => navigation.navigate("AppBeforeAuth")}
          titleStyle={{
            color: colorsConstants[theme].text,
            fontSize: fontUtils.h(12),
          }}
          mt={fontUtils.h(20)}
          mb={fontUtils.h(40)}
          type="outline"
        />
      )}
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyCenter,
          {
            paddingBottom: fontUtils.h(30),
          },
        ]}
      >
        <Text>Already NairaUp?</Text>
        <TouchableText
          ml={fontUtils.w(5)}
          color={colorPrimary}
          fontFamily={fontUtils.manrope_semibold}
          onPress={() => navigation.popTo("LoginScreen")}
        >
          Sign in
        </TouchableText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  bannerStyle: {
    width: "100%",
    height: fontUtils.h(123),
    borderRadius: fontUtils.r(16),
    marginTop: fontUtils.h(70),
  },
  btnIconStyle: {
    height: fontUtils.w(22),
    width: fontUtils.w(22),
    marginRight: fontUtils.w(10),
  },
});
