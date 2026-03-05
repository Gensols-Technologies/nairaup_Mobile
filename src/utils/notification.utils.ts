import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useEffect, useRef, useState } from "react";
import { colorPrimary } from "src/constants/colors.constants";
import SecureStoreManager from "./securestoremanager.utils";
import { APP_EXPO_PUSH_TOKEN } from "src/constants/app.constants";
import { OneSignal, LogLevel } from "react-native-onesignal";
import { ONESIGNAL_APP_ID } from "@env";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colorPrimary,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export const PushNotificationSetup = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    [],
  );
  // const [notification, setNotification] = useState<Notifications.Notification | undefined>(
  //   undefined
  // );
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  // Initialize OneSignal
  useEffect(() => {
    const initializeOneSignal = async () => {
      try {
        if (ONESIGNAL_APP_ID) {
          OneSignal.Debug.setLogLevel(LogLevel.Verbose);
          OneSignal.initialize(ONESIGNAL_APP_ID);
          console.log("✅ OneSignal initialized successfully");
        }
      } catch (error) {
        console.log("⚠️ OneSignal initialization error:", error);
      }
    };
    initializeOneSignal();
  }, []);

  useEffect(() => {
    if (expoPushToken && expoPushToken !== "") {
      // Console logging for debug
      console.log("✅ Expo push token saved:", expoPushToken);
      SecureStoreManager.saveItemToSecureStore(
        `${APP_EXPO_PUSH_TOKEN}`,
        expoPushToken,
      )
        .then(() => {})
        .catch((e) => console.log(e));
    }
  }, [expoPushToken]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? []),
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, []);

  return null;
};
