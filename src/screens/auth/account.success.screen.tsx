import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { Image, SafeAreaView, Text } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import { useAppSelector } from "src/hooks/useReduxHooks";

export default function AccountSuccessScreen({
  navigation,
  route,
}: RootStackScreenProps<"AccountSuccessScreen">) {
  const user = useAppSelector((state) => state.auth.user);
  const firstName = user?.profile?.firstname || "User";

  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require("src/assets/images/verification-success.png")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(20)}
        mb={fontUtils.h(15)}
        size={fontUtils.h(18)}
        align="center"
      >
        Account Creation Successful!
      </Text>
      <Text mb={fontUtils.h(30)} align="center">
        Welcome {firstName}, your account with NairaUp has been created
        successfully. Log in now to access all our services!
      </Text>
      <Button
        title="Proceed to Log In"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        })}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(30)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  bannerStyle: {
    width: fontUtils.w(276 * 0.9),
    height: fontUtils.w(255 * 0.9),
    alignSelf: "center",
  },
});
