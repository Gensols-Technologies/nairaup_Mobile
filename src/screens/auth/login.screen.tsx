import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  Image,
  SafeAreaView,
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
import { useGoogle } from "src/hooks/apis/useGoogle";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import { APP_EXPO_PUSH_TOKEN } from "src/constants/app.constants";

export default function LoginScreen({
  navigation,
  route,
}: RootStackScreenProps<"LoginScreen">) {
  const { theme } = useAppTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loading, signIn } = useAuth();
  const { loading: loadingGoogle, signInWithGoogle } = useGoogle();

  const doLogin = async () => {
    let pushnotificationtoken =
      (await SecureStoreManager.getItemFromSecureStore(
        `${APP_EXPO_PUSH_TOKEN}`,
      )) || "";

    // Validate push token - if it's an error message, use empty string
    if (
      pushnotificationtoken.includes("Error") ||
      pushnotificationtoken.includes("not initialized")
    ) {
      pushnotificationtoken = "";
    }

    const req = await signIn({
      username,
      password,
      pushnotificationtoken,
    });
    if (req.code === 200)
      setTimeout(() => {
        navigation.navigate("App");
      }, 500);
  };

  const doGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <ScrollView style={[styles.container]}>
      <Image
        source={require("src/assets/images/login-banner.jpg")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(30)}
        mb={fontUtils.h(30)}
        size={fontUtils.h(18)}
      >
        Log In
      </Text>
      <Input
        label="Enter Email/Phone Number"
        labelIcon={
          <SimpleLineIcons
            name="envelope"
            size={fontUtils.h(18)}
            color="black"
          />
        }
        value={username}
        onChangeText={setUsername}
      />
      <Input
        label="Enter Password"
        labelIcon={
          <SimpleLineIcons name="lock" size={fontUtils.h(18)} color="black" />
        }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        onSubmitEditing={doLogin}
      />
      <TouchableText
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        align="right"
      >
        Forgotten password?
      </TouchableText>
      <Button
        title="Log In"
        onPress={doLogin}
        loading={loading}
        disabled={username === "" || password === ""}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(25)}
      />
      <View style={[layoutConstants.styles.rowView]}>
        <Line flex={1} />
        <Text ml={fontUtils.w(5)} mr={fontUtils.w(5)}>{`Or`}</Text>
        <Line flex={1} />
      </View>
      {Platform.OS === "android" ? (
        <Button
          title="Log In with Google"
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
        ]}
      >
        <Text>New to NairaUp?</Text>
        <TouchableText
          ml={fontUtils.w(5)}
          color={colorPrimary}
          fontFamily={fontUtils.manrope_semibold}
          onPress={() => navigation.navigate("CreateAccountScreen")}
        >
          Sign up
        </TouchableText>
      </View>
      {Platform.OS === "android" ? (
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
      ) : null}
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
