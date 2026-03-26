import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  View,
  Text,
} from "src/components/themed.components";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import colorsConstants, {
  colorPrimary,
  colorSuccess,
  colorWhite,
} from "src/constants/colors.constants";
import { Button } from "src/components/buttons.components";
import { Icon } from "@rneui/themed";
import { ApartmentFeatures } from "./components/features.components";
import { PropertyObjectType } from "src/types/properties.types";
import { convertNumberToWords } from "src/utils/numbers.utils";
import { usePaystack } from "react-native-paystack-webview";
import { Toast } from "toastify-react-native";
import { useAppSelector } from "src/hooks/useReduxHooks";
import useTransaction from "src/hooks/apis/useTransactions";
import { useConnection } from "src/hooks/apis/useChat";
import { SimpleImageSlider } from "@one-am/react-native-simple-image-slider";
import { useGetPropertyQuery } from "src/services/redux/apis/unauth.api.requests";
import { CapitalizeFirstLetter } from "src/utils/app.utils";

export default function ApartmentViewScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentViewScreen">) {
  const { loading, createConnection } = useConnection();
  const [data, setData] = useState<PropertyObjectType>(route.params.data);
  const { email, mobile, profile } = useAppSelector((state) => state.auth.user);
  const { data: propertyData, isFetching } = useGetPropertyQuery(data.id);
  const imageurls = data.imageurls.split(",");
  const { popup } = usePaystack();
  const { loading: loadingTransactionRef, generatePaymentReference } =
    useTransaction();

  useEffect(() => {
    if (propertyData?.code === 200) setData(propertyData?.data);
  }, [propertyData]);

  const payNow = (amount: number, reference: string) => {
    popup.checkout({
      email,
      amount,
      reference,
      metadata: {
        propertyid: data.id,
        custom_fields: [
          {
            display_name: `Payment for property ${data?.title}`,
            variable_name: "propertyid",
            value: data.id,
          },
        ],
      },
      onSuccess: (res) => {
        console.log("Success:", res);
        navigation.navigate("HotelReserveSuccessScreen", {
          note: `Payment for the property ${data?.title} was successful`,
          title: "Payment for Apartment",
        });
      },
      onCancel: () =>
        Toast.show({
          type: "warn",
          text1: "Payment",
          text2: "Payment cancelled",
        }),
      onLoad: (res) => console.log("WebView Loaded:", res),
      onError: (err) => {
        Toast.show({
          type: "error",
          text1: "Payment",
          text2: "Error occured during payment",
        });
      },
    });
  };

  const doPayWithEscrow = async () => {
    const req = await generatePaymentReference({ propertyid: data.id }, () => {}, false);
    if (req.code === 201) {
      const totalPayable = Number(req.data?.amount || 0) + Number(req.data?.servicefee || 0);
      if (!totalPayable || totalPayable <= 0) {
        Toast.show({ type: "error", text1: "Payment Error", text2: "Invalid payment amount" });
        return;
      }
      payNow(totalPayable, req.data?.reference);
    } else {
      Toast.show({
        type: "error",
        text1: "Payment Error",
        text2: req?.message || "Could not initiate payment. Please try again.",
      });
    }
  };

  const doSendMessage = async (notification: any) => {
    try {
      if (!data?.profileid) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Property owner information not available",
          useModal: true,
        });
        return;
      }

      if (profile?.id === data?.profileid) {
        Toast.show({
          type: "warn",
          text1: "Cannot Message",
          text2: "You cannot message yourself",
          useModal: true,
        });
        return;
      }

      console.log("Creating connection with profileid:", data?.profileid);
      const connection = await createConnection({
        connectionid: data?.profileid,
        waitforresponse: true,
      });

      console.log("Connection response:", connection);

      if (connection?.code === 201 && connection?.data?.length > 0) {
        const connectionData = connection.data[0];
        navigation.navigate("MessagingScreen", {
          connectionstring: connectionData?.connectionstring,
          profile: {
            ...connectionData?.connection,
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Connection Failed",
          text2: connection?.message || "Failed to create connection",
          useModal: true,
        });
      }
    } catch (error: any) {
      console.error("Error in doSendMessage:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to send message",
        useModal: true,
      });
    }
  };

  const photos = [data.featuredimageurl];

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
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
          style={styles.frontViewImageStyle}
        />
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
            styles.subViewStyle,
          ]}
        >
          {imageurls.length > 1 ? (
            <ViewableImage
              source={{
                uri: imageurls[0],
              }}
              style={styles.subViewImageStyle}
            />
          ) : null}
          <ViewableImage
            source={{
              uri: imageurls[1],
            }}
            style={styles.subViewImageStyle}
          />
        </View> */}
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
            { marginTop: fontUtils.h(20) },
          ]}
        >
          <Text fontFamily={fontUtils.manrope_semibold}>{data.title}</Text>
          <View style={styles.valueViewStyle}>
            <Text fontFamily={fontUtils.manrope_semibold} color={colorPrimary}>
              {`N${convertNumberToWords(data.price)}`}
            </Text>
          </View>
        </View>
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
        <Text size={fontUtils.h(12)} mb={fontUtils.h(30)}>
          {data.description}
        </Text>
        {data?.status !== "sold" ? (
          <View style={[layoutConstants.styles.rowView]}>
            <Button
              title={"   Pay with Escrow"}
              onPress={doPayWithEscrow}
              disabled={loadingTransactionRef}
              loading={loadingTransactionRef}
              icon={
                <Icon
                  type="font-awesome"
                  name="tag"
                  color={colorWhite}
                  size={fontUtils.h(15)}
                />
              }
              buttonHeight={fontUtils.h(40)}
              borderRadius={fontUtils.r(12)}
              titleStyle={styles.actionBtnTitleStyle}
              wrapperStyle={[
                styles.actionBtnWrapperStyle,
                {
                  marginRight: fontUtils.w(5),
                },
              ]}
            />
            <Button
              title={"   Contact Owner"}
              disabled={loading}
              icon={
                <Icon
                  type="material-community"
                  name="chat"
                  color={colorWhite}
                  size={fontUtils.h(17)}
                />
              }
              onPress={doSendMessage}
              loading={loading}
              buttonHeight={fontUtils.h(40)}
              borderRadius={fontUtils.r(12)}
              backgroundColor={"#34A853"}
              titleStyle={styles.actionBtnTitleStyle}
              wrapperStyle={[
                styles.actionBtnWrapperStyle,
                {
                  marginLeft: fontUtils.w(5),
                },
              ]}
            />
          </View>
        ) : null}
        {data?.status === "sold" ? (
          <Button
            title={"Sold"}
            // disabled={true}
            backgroundColor={colorSuccess}
            activeOpacity={1}
            icon={
              <Icon
                type="font-awesome"
                name="tag"
                color={colorWhite}
                size={fontUtils.h(15)}
              />
            }
            buttonHeight={fontUtils.h(40)}
            borderRadius={fontUtils.r(12)}
            titleStyle={styles.actionBtnTitleStyle}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: fontUtils.h(30),
  },
  imagesViewStyle: {
    // borderRadius: fontUtils.r(16),
    overflow: "hidden",
  },
  frontViewImageStyle: {
    height: fontUtils.h(128),
    width: "100%",
    borderRadius: fontUtils.r(16),
  },
  subViewStyle: {
    marginTop: fontUtils.h(5),
    marginBottom: fontUtils.h(15),
  },
  subViewImageStyle: {
    height: fontUtils.h(80),
    width:
      (deivceWidth - layoutConstants.mainViewHorizontalPadding * 2) / 2 -
      fontUtils.w(3),
    borderRadius: fontUtils.r(16),
  },
  valueViewStyle: {
    marginLeft: fontUtils.w(15),
    paddingHorizontal: fontUtils.w(10),
    paddingVertical: fontUtils.h(5),
    borderRadius: fontUtils.r(16),
    backgroundColor: colorsConstants.convertToRgba(colorPrimary, 0.1),
  },
  actionBtnWrapperStyle: {
    flex: 1,
  },
  actionBtnTitleStyle: {
    fontFamily: fontUtils.manrope_medium,
    fontSize: fontUtils.h(12),
  },
});
