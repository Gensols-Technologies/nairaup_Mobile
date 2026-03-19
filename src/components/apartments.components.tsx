import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Image, Text, TouchableOpacity } from "./themed.components";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import { Button } from "./buttons.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PropertyObjectType } from "src/types/properties.types";
import { convertNumberToWords, shortenNumber } from "src/utils/numbers.utils";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { CapitalizeFirstLetter } from "src/utils/app.utils";
import { useSavePropertyMutation } from "src/services/redux/apis";

export const PurchasedApartmentItem = memo(
  function PurchasedApartmentItem({ }: {}) {
    return (
      <TouchableOpacity style={[styles.purchasedItemViewStyle]}>
        <Image
          source={require("src/assets/images/sliders/splash-1a.jpg")}
          style={styles.purchasedImageStyle}
        />
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <Text fontFamily={fontUtils.manrope_medium}>2 bedroom duplex</Text>
          <Text fontFamily={fontUtils.manrope_medium}>N34 million</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

export const SoldApartmentItem = memo(function SoldApartmentItem({
  property,
}: {
  property: PropertyObjectType;
}) {
  return (
    <TouchableOpacity
      style={[layoutConstants.styles.rowView, styles.soldItemViewStyle]}
    >
      <Image
        source={{
          uri: property?.featuredimageurl,
        }}
        style={styles.soldImageStyle}
      />
      <View style={[]}>
        <Text
          ml={fontUtils.w(5)}
          fontFamily={fontUtils.manrope_medium}
          mb={fontUtils.h(10)}
        >
          {property.title}
        </Text>
        <Text
          ml={fontUtils.w(5)}
          fontFamily={fontUtils.manrope_bold}
          color={colorPrimary}
        >
          {`${shortenNumber(Number(property.price))}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export const ApartmentListingItem = memo(function ApartmentListingItem(
  data: PropertyObjectType,
) {
  const [saveProperty] = useSavePropertyMutation();
  const { token } = useAppSelector((state) => state.auth);
  const navigation = useNavigation();
  const {
    address,
    category,
    city,
    createdat,
    price,
    averagerating,
    type,
    featuredimageurl,
    title,
    state,
    id,
  } = data;

  const onPress = () =>
    !token
      ? navigation.navigate("LoginScreen")
      : navigation.navigate(
        type === "hotel" || type === "shortlet"
          ? "HotelViewScreen"
          : "ApartmentViewScreen",
        {
          data,
        },
      );

  return (
    <TouchableOpacity style={[styles.listingViewStyle]} onPress={onPress}>
      <View style={styles.viewMainStyle}>
        <View>
          <Image
            source={{
              uri: featuredimageurl,
            }}
            style={styles.imageStyle}
            onPress={onPress}
          />
          <TouchableOpacity
            onPress={async () => {
              try {
                const res = await saveProperty({
                  propertyid: `${id}`,
                }).unwrap();
                if (res.code === 200 || res.code === 201) {
                  // Success
                }
              } catch (error) {
                console.log("Error saving property:", error);
              }
            }}
          >
            <Image
              source={require("src/assets/images/icons/stash_save-ribbon.png")}
              style={styles.ribbonStyle}
              wrapperStyle={styles.ribbontWrapperStyle}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            size={fontUtils.h(12)}
            fontFamily={fontUtils.manrope_bold}
            mt={fontUtils.h(5)}
            numberOfLines={1}
          >
            {title}
          </Text>
          {price ? (
            <View
              style={[
                layoutConstants.styles.rowView,
                layoutConstants.styles.justifyContentBetween,
              ]}
            >
              <Text
                color={colorPrimary}
                fontFamily={fontUtils.manrope_semibold}
                mb={fontUtils.h(5)}
                mt={fontUtils.h(5)}
              >
                {`N${convertNumberToWords(price)}`}
              </Text>
              {/* {averagerating ? (
              <Text size={fontUtils.h(10)}>{averagerating}</Text>
            ) : null} */}
            </View>
          ) : (
            <Text size={fontUtils.h(8)} mb={fontUtils.h(5)} mt={fontUtils.h(5)}>
              <Ionicons name="star" color="#FBBC05" />
              {` ${averagerating}`}
            </Text>
          )}
          <View
            style={[
              layoutConstants.styles.rowView,
              layoutConstants.styles.justifyContentBetween,
            ]}
          >
            {!price ? (
              <Text size={fontUtils.h(10)}>{`${CapitalizeFirstLetter(city)}${state ? `, ${CapitalizeFirstLetter(state)}` : ""
                }`}</Text>
            ) : null}
            <Text size={fontUtils.h(8)}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                color="black"
              />
              {` ${CapitalizeFirstLetter(city)}${state ? `, ${CapitalizeFirstLetter(state)}` : ""
                }`}
            </Text>
            {price ? (
              <Text size={fontUtils.h(8)}>
                <Ionicons name="star" color="#FBBC05" />
                {` ${averagerating}`}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <Button
        title={"View full info"}
        onPress={onPress}
        type="outline"
        titleStyle={styles.btnTitleStyle}
        buttonHeight={fontUtils.h(35)}
        wrapperStyle={styles.btnWrapperStyle}
      />
    </TouchableOpacity>
  );
});

export const styles = StyleSheet.create({
  listingViewStyle: {
    width: fontUtils.w(157),
    borderTopRightRadius: fontUtils.r(16),
    borderTopLeftRadius: fontUtils.r(16),
    overflow: "hidden",
    marginRight: fontUtils.w(20),
    // borderWidth: fontUtils.w(1),
    // borderRadius: fontUtils.r(12),
  },
  viewMainStyle: {
    flex: 1,
  },
  imageStyle: {
    width: fontUtils.w(157),
    height: fontUtils.h(117),
    borderRadius: fontUtils.r(16),
  },
  ribbonStyle: {
    height: fontUtils.w(20),
    width: fontUtils.w(20),
    marginTop: fontUtils.h(15),
  },
  ribbontWrapperStyle: {
    width: fontUtils.h(24),
    height: fontUtils.h(24),
    borderRadius: fontUtils.h(24),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorWhite,
    position: "absolute",
    top: fontUtils.w(10),
    right: fontUtils.w(10),
  },
  btnTitleStyle: {
    fontSize: fontUtils.h(10),
  },
  btnWrapperStyle: {
    marginTop: fontUtils.h(5),
  },
  purchasedItemViewStyle: {
    width: deivceWidth - layoutConstants.mainViewHorizontalPadding * 2,
    marginBottom: fontUtils.h(20),
    paddingBottom: fontUtils.h(15),
    borderBottomWidth: 1,
    borderBlockColor: "rgba(0, 0, 0, 0.1)",
  },
  purchasedImageStyle: {
    width: "100%",
    height: fontUtils.h(168),
    borderRadius: fontUtils.r(20),
    marginBottom: fontUtils.h(10),
  },
  soldItemViewStyle: {
    backgroundColor: "#EFF5FE",
    borderRadius: fontUtils.r(10),
  },
  soldImageStyle: {
    width: fontUtils.w(120),
    height: fontUtils.w(89),
    borderRadius: fontUtils.r(10),
  },
});
