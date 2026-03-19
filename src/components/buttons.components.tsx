import { Button as RNEButton, ButtonProps } from "@rneui/themed";
import React from "react";
import {
  ColorValue,
  Platform,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import layoutConstant from "src/constants/layout.constants";
import fontUtil from "src/utils/font.utils";
import { StyleSheet } from "react-native";
import { colorPrimary } from "src/constants/colors.constants";

type buttonPropsType = {
  type?: "outline" | "solid" | "clear";
  titleStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  buttonHeight?: number;
  borderRadius?: number;
  backgroundColor?: ColorValue;
  borderColor?: ColorValue;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
} & ButtonProps;

export const Button = ({
  buttonHeight = layoutConstant.buttonHeight,
  titleStyle = {},
  buttonStyle = {},
  wrapperStyle,
  type = "solid",
  borderRadius = layoutConstant.buttonRadius,
  backgroundColor = colorPrimary,
  mx,
  my,
  mt,
  mb,
  disabled,
  loading,
  borderColor,
  ...props
}: buttonPropsType) => {
  return (
    <View
      style={[
        styles.buttonViewStyle,
        {
          marginVertical: my,
          marginHorizontal: mx,
          marginTop: mt,
          marginBottom: mb,
        },
        wrapperStyle,
      ]}
    >
      <RNEButton
        titleProps={{
          adjustsFontSizeToFit: true,
          numberOfLines: 1,
        }}
        titleStyle={[
          {
            fontFamily: fontUtil.manrope_semibold,
            fontSize: fontUtil.h(14),
            textTransform: "capitalize",
          },
          titleStyle,
        ]}
        type={type}
        loading={loading}
        disabled={(disabled || loading) && Platform.OS === "ios"}
        activeOpacity={layoutConstant.activeOpacity}
        buttonStyle={[
          {
            height: buttonHeight,
            borderRadius: borderRadius,
            backgroundColor: type === "solid" ? backgroundColor : undefined,
            borderWidth:
              type === "outline" || borderColor ? fontUtil.h(1) : undefined,
            borderColor:
              type === "outline"
                ? borderColor
                  ? borderColor
                  : backgroundColor
                : undefined,
          },
          buttonStyle,
        ]}
        containerStyle={[
          {
            height: buttonHeight,
            borderRadius: borderRadius,
          },
        ]}
        radius={borderRadius}
        disabledTitleStyle={
          {
            // color: colorDisabledTitle,
          }
        }
        disabledStyle={styles.disabledStyle}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonViewStyle: {
    borderRadius: fontUtil.r(10),
  },
  disabledStyle: {
    // backgroundColor: colorDisabledBtn,
  },
});
