import { RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator, RefreshControlProps, View } from "react-native";
import React from "react";
import { colorPrimary } from "src/constants/colors.constants";
import { StyleSheet } from "react-native";
import { Text } from "./themed.components";
import fontUtils from "src/utils/font.utils";

export const AppRefreshControl = React.forwardRef<
  RefreshControl,
  RefreshControlProps
>(({ ...props }, ref) => {
  return (
    <RefreshControl
      ref={ref}
      colors={[colorPrimary]}
      tintColor={colorPrimary}
      title={`Refreshing`}
      titleColor={colorPrimary}
      {...props}
      hitSlop={undefined}
    />
  );
});

export const ListFooterLoading = ({ refreshing }: { refreshing: boolean }) => {
  if (!refreshing) return null;
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator color={colorPrimary} />
      <Text style={styles.loadingText}>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: fontUtils.h(20),
  },
  loadingText: {
    opacity: 0.8,
    marginLeft: fontUtils.w(5),
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(10),
  },
});
