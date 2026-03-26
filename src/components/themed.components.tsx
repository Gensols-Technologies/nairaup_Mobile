/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React, { useRef, useState } from "react";
import {
  ScrollViewProps as DefaultScrollViewProps,
  Text as DefaultText,
  View as DefaultView,
  StyleSheet,
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  Platform,
  ColorValue,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";
import { Avatar, AvatarProps, IconProps, Icon as RNEIcon } from "@rneui/themed";
import { Modalize } from "react-native-modalize";
import { ScrollView as DefaultScrollView } from "react-native-gesture-handler";

import {
  SafeAreaView as DefaultSafeAreaView,
  SafeAreaViewProps as DefaultSafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import colorsConstants, {
  colorDanger,
  colorPrimary,
} from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { Image as ExpoImage, ImageProps } from "expo-image";
import {
  IMAGE_PLACEHOLDER,
  IMAGE_TRANSITION,
} from "src/constants/app.constants";
import { useAppTheme } from "src/providers/theme.provider";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof colorsConstants.light &
    keyof typeof colorsConstants.dark,
) {
  const { theme } = useAppTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colorsConstants[theme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps &
  DefaultText["props"] & {
    size?: number;
    lineHeight?: number;
    align?: "auto" | "left" | "right" | "center" | "justify" | undefined;
    fontFamily?: any;
    type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "small"
    | "extraSmall";
    mt?: number;
    mb?: number;
    ml?: number;
    mr?: number;
    m?: number;
    textDecorationLine?:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
    color?: ColorValue;
  };
export type ViewProps = ThemeProps & DefaultView["props"];
export type SafeAreaViewProps = ThemeProps & DefaultSafeAreaViewProps;
export type ScrollViewProps = ThemeProps & DefaultScrollViewProps;

export function Text(props: TextProps) {
  const {
    style,
    lightColor,
    darkColor,
    size = fontUtils.h(14),
    lineHeight,
    align,
    ml,
    mr,
    mt,
    mb,
    m,
    textDecorationLine,
    fontFamily = fontUtils.manrope_regular,
    color,
    ...otherProps
  } = props;
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );

  return (
    <DefaultText
      style={[
        styles.defaultTextStyle,
        {
          color: color ? color : themeColor,
          textDecorationLine,
        },
        { fontSize: size },
        { lineHeight: lineHeight },
        { textAlign: align },
        { marginLeft: ml, marginRight: mr, marginTop: mt, marginBottom: mb },
        { margin: m },
        { fontFamily },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "screenGb",
  );

  return (
    <DefaultSafeAreaView
      edges={["right", "bottom", "left"]}
      style={[
        styles.defaultSafeAreaViewStyle,
        {
          backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function ScrollView(
  props: ScrollViewProps & {
    withKeyboard?: boolean;
  },
) {
  const {
    style,
    lightColor,
    darkColor,
    children,
    withKeyboard,
    contentContainerStyle,
    horizontal,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "screenGb",
  );

  const { bottom } = useSafeAreaInsets();

  if (withKeyboard && Platform.OS === "android")
    return (
      <DefaultScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={horizontal}
        style={[{ backgroundColor }, style]}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          {
            paddingBottom: !horizontal ? bottom : 0,
          },
          contentContainerStyle,
        ]}
        {...otherProps}
      >
        <KeyboardAvoidingView behavior="padding">
          {children}
        </KeyboardAvoidingView>
      </DefaultScrollView>
    );

  return (
    //@ts-ignore
    <DefaultScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={horizontal}
      style={[{ backgroundColor }, style]}
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[
        {
          paddingBottom: !horizontal ? bottom : 0,
        },
        contentContainerStyle,
      ]}
      children={children}
      {...otherProps}
    />
  );
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { activeOpacity = layoutConstants.activeOpacity, ...otherProps } =
    props;
  return <RNTouchableOpacity activeOpacity={activeOpacity} {...otherProps} />;
}

export function Image(
  props: ImageProps & {
    onPress?: any;
    isLoading?: boolean;
    wrapperStyle?: StyleProp<ViewStyle>;
  },
) {
  const {
    onPress,
    isLoading,
    source,
    placeholder = {
      blurhash: IMAGE_PLACEHOLDER,
    },
    wrapperStyle,
    ...otherProps
  } = props;

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? layoutConstants.activeOpacity : 1}
      style={wrapperStyle}
    >
      <ExpoImage
        placeholder={placeholder}
        placeholderContentFit="contain"
        onLoadStart={() => setImageLoaded(false)}
        onLoad={() => setImageLoaded(true)}
        transition={IMAGE_TRANSITION}
        source={source}
        {...otherProps}
      />
      {(!imageLoaded &&
        source &&
        //@ts-ignore
        source?.uri !== "") ||
        (isLoading && (
          <DefaultView
            style={{
              ...StyleSheet.absoluteFillObject,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color={colorPrimary} size={fontUtils.h(30)} />
          </DefaultView>
        ))}
    </TouchableOpacity>
  );
}

export function ViewableImage(
  props: ImageProps & {
    onPress?: Function;
    withDelete?: boolean;
    doDelete?: (event: GestureResponderEvent) => void;
    loading?: boolean;
  },
) {
  const {
    source,
    placeholder = {
      blurhash: IMAGE_PLACEHOLDER,
    },
    onPress,
    withDelete,
    doDelete = () => null,
    loading,
    ...otherProps
  } = props;
  const modalRef = useRef<Modalize>(null);
  const { theme } = useAppTheme();

  const onPressImage = () => {
    if (onPress) onPress();
    else modalRef?.current?.open();
  };

  return (
    <DefaultView>
      <TouchableOpacity
        onPress={onPressImage}
        activeOpacity={layoutConstants.activeOpacity}
      >
        <ExpoImage
          placeholder={placeholder}
          placeholderContentFit="contain"
          transition={IMAGE_TRANSITION}
          source={source}
          {...otherProps}
        />
      </TouchableOpacity>
      <Modalize
        ref={modalRef}
        withReactModal
        modalStyle={{
          minHeight: "100%",
        }}
        panGestureEnabled={false}
      >
        <View
          style={[
            styles.viewableImageModalContainer,
            {
              backgroundColor:
                theme === "dark"
                  ? colorsConstants.light.background
                  : colorsConstants.dark.background,
            },
          ]}
        >
          <DefaultView
            style={[
              layoutConstants.styles.rowView,
              styles.modalActionBtnContainer,
            ]}
          >
            {withDelete ? (
              <TouchableText
                color={colorDanger}
                onPress={doDelete}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={colorDanger} /> : "Delete"}
              </TouchableText>
            ) : (
              <View></View>
            )}
            <View style={styles.closeBtnContainer}>
              <Icon
                name="close"
                type="ionicon"
                onPress={() => modalRef?.current?.close()}
              />
            </View>
          </DefaultView>
          <ExpoImage
            transition={IMAGE_TRANSITION}
            source={source}
            style={styles.imageStyle}
            contentFit="cover"
          />
        </View>
      </Modalize>
    </DefaultView>
  );
}

export function ViewableAvatar(
  props: AvatarProps & {
    onPress?: Function;
  },
) {
  const { source, onPress, ...otherProps } = props;
  const modalRef = useRef<Modalize>(null);
  const { theme } = useAppTheme();

  const onPressImage = () => {
    if (onPress) onPress();
    else modalRef?.current?.open();
  };

  return (
    <DefaultView>
      <TouchableOpacity
        onPress={onPressImage}
        activeOpacity={layoutConstants.activeOpacity}
      >
        <Avatar source={source} {...otherProps} />
      </TouchableOpacity>
      <Modalize
        ref={modalRef}
        withReactModal
        modalStyle={{
          minHeight: "100%",
        }}
        panGestureEnabled={false}
      >
        <View
          style={[
            styles.viewableImageModalContainer,
            {
              backgroundColor:
                theme === "dark"
                  ? colorsConstants.light.background
                  : colorsConstants.dark.background,
            },
          ]}
        >
          <View style={styles.closeBtnContainer}>
            <Icon
              name="close"
              type="ionicon"
              onPress={() => modalRef?.current?.close()}
            />
          </View>
          <ExpoImage
            transition={IMAGE_TRANSITION}
            source={source}
            style={styles.imageStyle}
            contentFit="cover"
          />
        </View>
      </Modalize>
    </DefaultView>
  );
}

export function TouchableText(props: TextProps) {
  const { onPress, ...otherProps } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Text {...otherProps} />
    </TouchableOpacity>
  );
}

export function Icon(
  props: IconProps & {
    onPress?: any;
  },
) {
  const { onPress, onPressIn, disabled, ...otherProps } = props;

  return (
    <TouchableOpacity
      activeOpacity={layoutConstants.activeOpacity}
      onPress={onPress}
      disabled={disabled}
    >
      <RNEIcon {...otherProps} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  defaultTextStyle: {
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(12),
  },
  defaultSafeAreaViewStyle: {
    flex: 1,
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
    paddingTop: layoutConstants.mainViewHorizontalPadding / 2,
  },
  viewableImageModalContainer: {
    minHeight: "100%",
    justifyContent: "center",
  },
  imageStyle: {
    width: deivceWidth,
    height: deivceWidth,
  },
  closeBtnContainer: {
    // position: "absolute",
    // top: fontUtils.h(50),
    // right: fontUtils.w(20),
  },
  modalActionBtnContainer: {
    position: "absolute",
    top: fontUtils.h(50),
    width: deivceWidth,
    justifyContent: "space-between",
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
});
