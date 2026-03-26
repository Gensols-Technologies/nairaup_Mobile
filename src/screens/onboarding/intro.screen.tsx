import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { Image, SafeAreaView, Text } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import { APP_INITIAL_ROUTE } from "src/constants/app.constants";
import { useAppSelector } from "src/hooks/useReduxHooks";

export default function OnboardingIntroScreen({
  navigation,
  route,
}: RootStackScreenProps<"OnboardingIntroScreen">) {
  const { token } = useAppSelector((state) => state.auth);
  const [slide, setSlide] = useState(0);
  const INTRO_SLIDES = [
    {
      imageA: require("src/assets/images/sliders/splash-1a.jpg"),
      imageB: require("src/assets/images/sliders/splash-1b.jpg"),
      title: (
        <Text
          align="center"
          size={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_extrabold}
        >
          <Text
            size={fontUtils.h(20)}
            fontFamily={fontUtils.manrope_extrabold}
            color={colorPrimary}
          >
            Apartments
          </Text>{" "}
          {`that suit your\ntaste!`}
        </Text>
      ),
      note: "Looking for your next apartment shouldn't feel like a chore",
    },
    {
      imageA: require("src/assets/images/sliders/splash-2a.jpg"),
      imageB: require("src/assets/images/sliders/splash-2b.jpg"),
      title: (
        <Text
          align="center"
          size={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_extrabold}
        >
          {`Access to all Household\n`}
          <Text
            size={fontUtils.h(20)}
            fontFamily={fontUtils.manrope_extrabold}
            color={colorPrimary}
          >
            Services!
          </Text>
        </Text>
      ),
      note: " Let our trusted professionals handle all your household services so you focus on what matters most.",
    },
    {
      imageA: require("src/assets/images/sliders/splash-3a.jpg"),
      imageB: require("src/assets/images/sliders/splash-3b.jpg"),
      title: (
        <Text
          align="center"
          size={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_extrabold}
        >
          {`Find `}
          <Text
            size={fontUtils.h(20)}
            fontFamily={fontUtils.manrope_extrabold}
            color={colorPrimary}
          >
            Hotels
          </Text>
          {"\n"}
          {`around you!`}
        </Text>
      ),
      note: "Planning a trip? From chic city hotels to peaceful getaways, we help you find a stay that fits your style.",
    },
    {
      imageA: require("src/assets/images/sliders/splash-4a.jpg"),
      imageB: require("src/assets/images/sliders/splash-4b.jpg"),
      title: (
        <Text
          align="center"
          size={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_extrabold}
        >
          <Text
            size={fontUtils.h(20)}
            fontFamily={fontUtils.manrope_extrabold}
            color={colorPrimary}
          >
            Job
          </Text>{" "}
          {`search made\neasier`}
        </Text>
      ),
      note: "Ready to take the next step? We connect you to job opportunities that match your skills, interests, and goals.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (slide === INTRO_SLIDES.length - 1) setSlide(0);
      else setSlide(slide + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [slide]);

  const doGetStarted = async () => {
    await SecureStoreManager.saveItemToAsyncStorage(
      APP_INITIAL_ROUTE,
      "LoginScreen",
    );
    if (token) {
      navigation.navigate("App");
    } else {
      navigation.navigate("CreateAccountScreen");
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.mainContentStyle}>
        <View style={styles.slideAViewStyle}>
          <Image
            source={INTRO_SLIDES[slide].imageA}
            style={styles.slideAStyle}
          />
        </View>
        <View style={styles.slideBViewStyle}>
          <Image
            source={INTRO_SLIDES[slide].imageB}
            style={styles.slideBStyle}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
            marginTop: fontUtils.h(30),
            marginRight: layoutConstants.mainViewHorizontalPadding,
            // marginBottom: fontUtils.h(20),
          }}
        >
          {Array(INTRO_SLIDES.length)
            .fill(0)
            .map((i, _i) => (
              <View
                key={_i.toString()}
                style={{
                  width: fontUtils.w(_i === slide ? 30 : 15),
                  height: fontUtils.h(4),
                  backgroundColor: _i === slide ? colorPrimary : "#E2E8F0",
                  marginLeft: fontUtils.w(2),
                  borderRadius: fontUtils.w(10),
                }}
              ></View>
            ))}
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      >
        {INTRO_SLIDES[slide].title}
        <Text align="center" mt={fontUtils.h(10)} mb={fontUtils.h(10)}>
          {INTRO_SLIDES[slide].note}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      >
        <Button title="Get Started" onPress={doGetStarted} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: fontUtils.h(30),
  },
  mainContentStyle: {
    flex: 1,
  },
  slideAStyle: {
    height: fontUtils.h(324),
    width: fontUtils.w(261),
    borderBottomRightRadius: fontUtils.r(16),
  },
  slideAViewStyle: {
    alignSelf: "flex-start",
    marginTop: fontUtils.h(162),
    borderWidth: fontUtils.w(3),
    borderLeftWidth: 0,
    borderBottomWidth: fontUtils.w(3),
    borderColor: colorWhite,
    borderBottomRightRadius: fontUtils.r(16),
  },
  slideBStyle: {
    height: fontUtils.h(324),
    width: fontUtils.w(261),
    borderBottomLeftRadius: fontUtils.r(16),
  },
  slideBViewStyle: {
    position: "absolute",
    alignSelf: "flex-end",
    borderLeftWidth: fontUtils.w(3),
    borderBottomWidth: fontUtils.w(3),
    borderColor: colorWhite,
    borderBottomLeftRadius: fontUtils.r(16),
  },
});
