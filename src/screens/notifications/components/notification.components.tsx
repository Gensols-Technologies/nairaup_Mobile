import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Button } from "src/components/buttons.components";
import { Icon, Text, TouchableOpacity } from "src/components/themed.components";
import { colorSuccess, colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { useMarkNotificationsReadMutation } from "src/services/redux/apis";
import { NotificationObjectType } from "src/types/notifications.types";
import fontUtils from "src/utils/font.utils";

export const NotificationItem = memo(function NotificationItem(
  data: NotificationObjectType,
) {
  const [markRead] = useMarkNotificationsReadMutation();
  const [status, setStatus] = useState(data.status);

  const modalRef = useRef<Modalize>(null);
  const viewNotification = () => {
    modalRef.current?.open();
    if (status === "pending")
      markRead({ ids: [data.id] }).then((r: any) => {
        if (!r.error) {
          setStatus("read");
        }
      });
  };


  return (
    <View>
      <TouchableOpacity
        style={[styles.wrapperStyle]}
        onPress={viewNotification}
      >
        <Ionicons
          name={status === "read" ? "checkmark-circle-outline" : "ellipse"}
          size={fontUtils.h(20)}
          color={colorSuccess}
        />
        <View style={[styles.mainContentStyle]}>
          <Text size={fontUtils.h(12)} fontFamily={fontUtils.manrope_semibold}>
            {data.title}
          </Text>
          <Text size={fontUtils.h(10)} mt={fontUtils.h(3)}>
            {data.notification}
          </Text>
        </View>
      </TouchableOpacity>
      <ViewNotificationModal data={data} modalRef={modalRef} />
    </View>
  );
});

export const ViewNotificationModal = ({
  data,
  modalRef,
}: {
  data: NotificationObjectType;
  modalRef?: any;
}) => {
  return (
    <Modalize
      ref={modalRef}
      withHandle={false}
      withReactModal
      modalStyle={{
        minHeight: `100%`,
        backgroundColor: `transparent`,
      }}
    >
      <View
        style={{
          backgroundColor: `transparent`,
          minHeight: `100%`,
          justifyContent: `center`,
          paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      >
        <View style={styles.modalContentStyle}>
          <Icon
            name="close-circle"
            type="ionicon"
            color={"rgba(0, 0, 0, 0.7)"}
            containerStyle={styles.closeIconContainerStyle}
            onPress={() => modalRef?.current?.close()}
          />
          <Ionicons
            name="checkmark-circle-outline"
            size={fontUtils.h(35)}
            color={colorSuccess}
            style={styles.notificationIconStyle}
          />
          <Text
            align="center"
            mb={fontUtils.h(15)}
            fontFamily={fontUtils.manrope_semibold}
          >
            {data.title}
          </Text>
          <Text mb={fontUtils.h(20)} align="center" size={fontUtils.h(12)}>
            {data.notification}
          </Text>
          {data.type === "propertyrejected" ? (
            <View
              style={[layoutConstants.styles.rowView, styles.btnsViewStyle]}
            >
              <Button
                title={"Go Back"}
                buttonHeight={fontUtils.h(40)}
                titleStyle={styles.btnTitleStyle}
                type="outline"
                buttonStyle={styles.backBtnStyle}
              />
              <Button
                title={"Contact Admin"}
                buttonHeight={fontUtils.h(40)}
                titleStyle={styles.btnTitleStyle}
                wrapperStyle={styles.okBtnStyle}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: fontUtils.r(10),
    paddingHorizontal: fontUtils.w(10),
    paddingVertical: fontUtils.h(10),
    marginBottom: fontUtils.h(15),
  },
  mainContentStyle: {
    marginLeft: fontUtils.w(10),
    flex: 1,
  },
  modalContentStyle: {
    borderRadius: fontUtils.w(12),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(10),
    backgroundColor: colorWhite,
  },
  btnTitleStyle: {
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(12),
  },
  btnsViewStyle: {},
  backBtnStyle: {
    paddingHorizontal: fontUtils.w(20),
  },
  okBtnStyle: {
    flex: 1,
    marginLeft: fontUtils.w(15),
  },
  closeIconContainerStyle: {
    alignSelf: "flex-end",
  },
  notificationIconStyle: {
    alignSelf: "center",
    marginBottom: fontUtils.h(10),
  },
});
