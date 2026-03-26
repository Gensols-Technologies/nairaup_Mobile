import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ViewableImage,
} from "src/components/themed.components";
import Constants from "expo-constants";
import { Bar } from "react-native-progress";
import { Button } from "src/components/buttons.components";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons } from "@expo/vector-icons";
import colorsConstants, {
  colorPrimary,
  colorSuccess,
} from "src/constants/colors.constants";
import { useAppTheme } from "src/providers/theme.provider";
import { ApartmentFeatures } from "../apartments/components/features.components";
import { ReviewItem } from "./components/reviews.components";
import { RoomItem } from "./components/rooms.components";
import { useGetActiveReservationQuery } from "src/services/redux/apis";
import {
  AddPropertyRoomDto,
  PropertyObjectType,
} from "src/types/properties.types";
import { openGoogleMapsLocation } from "src/utils/location.utils";
import { SimpleImageSlider } from "@one-am/react-native-simple-image-slider";
import { useGetPropertyQuery } from "src/services/redux/apis/unauth.api.requests";
import { CapitalizeFirstLetter } from "src/utils/app.utils";

export default function HotelViewScreen({
  navigation,
  route,
}: RootStackScreenProps<"HotelViewScreen">) {
  const { theme } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [data, setData] = useState<PropertyObjectType>(route.params.data);
  const [reviews, setReviews] = useState([]);
  const { data: propertyData, isFetching } = useGetPropertyQuery(data.id);
  const {
    data: activeReservation,
    refetch,
    isFetching: fetchingReservation,
    isLoading: loadingReservation,
  } = useGetActiveReservationQuery(data.id);
  const imageurls = data.imageurls.split(",");

  useEffect(() => {
    refetch();
    if (propertyData?.code === 200) {
      setData(propertyData?.data);
      setReviews(propertyData?.data?.reviews || []);
    }
  }, [propertyData]);

  const renderRoom = useCallback(
    ({ item, index }: { item: AddPropertyRoomDto; index: number }) => (
      //@ts-ignore
      <RoomItem {...item} />
    ),
    [],
  );

  const doOpenMap = async () => {
    const geocode = data?.geocode?.split(",");
    await openGoogleMapsLocation(
      Number(geocode[0] || 0),
      Number(geocode[1] || 0),
      data?.title,
    );
  };

  const onSelectRoom = () => {
    if (activeReservation?.code === 200)
      navigation.navigate("HotelReservationViewScreen", {
        data: activeReservation.data,
      });
    else
      scrollViewRef?.current?.scrollToEnd({
        animated: true,
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[layoutConstants.styles.rowView]}
        >
          <Ionicons
            name="chevron-back"
            size={fontUtils.h(20)}
            color={colorsConstants[theme].text}
          />
          <Text ml={fontUtils.w(5)} size={fontUtils.h(12)}>
            Go back
          </Text>
        </TouchableOpacity>
        <Button
          title={
            activeReservation?.code === 200 ? "View reservation" : "Select room"
          }
          backgroundColor={
            activeReservation?.code === 200 ? colorSuccess : colorPrimary
          }
          loading={fetchingReservation || loadingReservation}
          onPress={onSelectRoom}
          buttonHeight={fontUtils.h(30)}
          titleStyle={{
            fontSize: fontUtils.h(10),
          }}
        />
      </View>
      <ScrollView
        //@ts-ignore
        scrollViewRef={scrollViewRef}
        contentContainerStyle={{
          paddingBottom: fontUtils.h(30),
        }}
      >
        <View style={styles.imagesViewStyle}>
          <SimpleImageSlider
            data={[data.featuredimageurl, ...data?.imageurls.split(",")].map(
              (photo, index) => ({
                source: photo,
                key: index.toString(),
              }),
            )}
            imageWidth={
              deivceWidth - layoutConstants.mainViewHorizontalPadding * 2
            }
            fullScreenImageAspectRatio={1 / 1}
            imageAspectRatio={16 / 9}
            fullScreenEnabled={true}
            renderFullScreenDescription={(_, index) => (
              <Text style={{ color: "#ffffff" }}>Picture {index + 1}</Text>
            )}
          />
        </View>
        {/* <ViewableImage
          source={{
            uri: data.featuredimageurl,
          }}
          style={styles.featuredImgStyle}
        /> */}
        <View style={styles.mainContent}>
          <Text mt={fontUtils.h(16)} fontFamily={fontUtils.manrope_bold}>
            {data.title}
          </Text>
          {!isFetching && data?.features ? (
            <ApartmentFeatures
              features={[
                {
                  color: colorPrimary,
                  feature: `${data.address}\n${CapitalizeFirstLetter(
                    data.city,
                  )} ${data.state ? `, ${CapitalizeFirstLetter(data.state)}` : ``
                    }`,
                  id: -1,
                  slug: "location",
                },
                ...data?.features,
              ]}
            />
          ) : null}
          <Text fontFamily={fontUtils.manrope_medium} mb={fontUtils.h(5)}>
            Description
          </Text>
          <Text size={fontUtils.h(12)} mb={fontUtils.h(20)}>
            {data.description || "NA"}
          </Text>
          <Button
            title="Show location in map"
            onPress={doOpenMap}
            backgroundColor={"#EFF5FE"}
            titleStyle={{
              color: colorsConstants[theme].text,
              fontSize: fontUtils.h(12),
            }}
            borderColor={colorsConstants.convertToRgba(colorPrimary, 0.5)}
          />
          <Text
            fontFamily={fontUtils.manrope_medium}
            mb={fontUtils.h(15)}
            mt={fontUtils.h(20)}
          >
            Ratings
          </Text>
          {[
            {
              value: ((data?.averagecleanlinessrating ?? 0) / 5) * 100,
              label: "Cleanliness",
              label2: data?.averagecleanlinessrating ?? 0,
            },
            {
              value: ((data?.averagecustomerservicerating ?? 0) / 5) * 100,
              label: "Customer Service",
              label2: data?.averagecustomerservicerating ?? 0,
            },
            {
              value: ((data?.averagehospitalityrating ?? 0) / 5) * 100,
              label: "Hospitality",
              label2: data?.averagehospitalityrating ?? 0,
            },
          ].map((r) => (
            <View key={r.label} style={styles.reviewItemStyle}>
              <View
                style={[
                  layoutConstants.styles.rowView,
                  layoutConstants.styles.justifyContentBetween,
                ]}
              >
                <Text mb={fontUtils.h(5)} size={fontUtils.h(12)}>
                  {r.label}
                </Text>
                <Text mb={fontUtils.h(5)} size={fontUtils.h(12)}>
                  {r.label2}/5
                </Text>
              </View>
              <Bar
                color={colorPrimary}
                progress={r.value / 100}
                unfilledColor={colorsConstants[theme].background}
                animated
                height={fontUtils.h(5)}
                width={null}
              />
            </View>
          ))}
          {reviews?.length > 0 ? (
            <Text
              fontFamily={fontUtils.manrope_medium}
              mb={fontUtils.h(5)}
              mt={fontUtils.h(20)}
            >
              Reviews
            </Text>
          ) : null}
          <FlatList
            data={reviews}
            renderItem={({ item, index }: any) => (
              <ReviewItem
                firstname={item?.profile?.firstname}
                note={item?.note}
                city={item?.profile?.city || item?.profile?.state}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Text
            fontFamily={fontUtils.manrope_medium}
            mb={fontUtils.h(5)}
            mt={fontUtils.h(20)}
          >
            Rooms and Pricing
          </Text>
          <FlatList
            data={data?.propertyrooms || []}
            renderItem={renderRoom}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: Constants.statusBarHeight + fontUtils.h(30),
    alignItems: "flex-end",
    paddingBottom: fontUtils.h(10),
    marginHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  imagesViewStyle: {
    // borderRadius: fontUtils.r(16),
    overflow: "hidden",
  },
  featuredImgStyle: {
    width: deivceWidth,
    height: fontUtils.h(167),
  },
  mainContent: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  reviewItemStyle: {
    marginBottom: fontUtils.h(12),
  },
});
