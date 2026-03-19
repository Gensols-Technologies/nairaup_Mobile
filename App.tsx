/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { View } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { colorPrimary } from "src/constants/colors.constants";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "src/navigation";
import useCachedResources from "src/hooks/useCachedResources";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import { APP_INITIAL_ROUTE } from "src/constants/app.constants";
import { StatusBar } from "expo-status-bar";
import ToastManager from "toastify-react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Notifications from "expo-notifications";
import { persistor, store } from "src/services/redux/store";
import { AppThemeProvider } from "src/providers/theme.provider";
import { PageProvider } from "src/providers/page.provider";
import { PushNotificationSetup } from "src/utils/notification.utils";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { PaystackProvider } from "react-native-paystack-webview";
import { PAYSTACK_PUBLIC_KEY } from "@env";
import { KeyboardProvider } from "react-native-keyboard-controller";
import RefreshFirebaseToken from "src/components/firebase.token.refresh";
import { SimpleImageSliderThemeProvider } from "@one-am/react-native-simple-image-slider";

GoogleSignin.configure({
  webClientId:
    "842923839141-je7la5iqamk8dhd6613a15gb1hdio9k7.apps.googleusercontent.com",
  offlineAccess: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

function App() {
  const [loading, setLoading] = useState(true);
  const isLoadingComplete = useCachedResources();
  const [initialRouteName, setInitialRouteName] = useState<any>(
    "OnboardingIntroScreen",
  );

  const loadData = async () => {
    try {
      const initialRoute = await SecureStoreManager.getItemFromAsyncStorage(
        `${APP_INITIAL_ROUTE}`,
      );
      setInitialRouteName(
        initialRoute !== null ? initialRoute : "OnboardingIntroScreen",
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onViewTap = () => {
    Keyboard.dismiss();
  };

  if (!isLoadingComplete || loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={fontUtils.h(40)} color={colorPrimary[500]} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <KeyboardProvider preserveEdgeToEdge>
        <AppThemeProvider>
          <PageProvider>
            <TouchableWithoutFeedback onPress={onViewTap}>
              <SafeAreaProvider>
                <Provider store={store}>
                  <PersistGate loading={null} persistor={persistor}>
                    <StatusBar style="dark" translucent />
                    <PaystackProvider publicKey={PAYSTACK_PUBLIC_KEY}>
                      <SimpleImageSliderThemeProvider>
                        <Navigation
                          colorScheme={"light"}
                          initialRouteName={initialRouteName}
                        />
                      </SimpleImageSliderThemeProvider>
                    </PaystackProvider>
                    <PushNotificationSetup />
                    <ToastManager
                      useModal={false}
                      topOffset={0}
                      iconSize={fontUtils.h(22)}
                      closeIconSize={fontUtils.h(20)}
                    />
                    <RefreshFirebaseToken />
                  </PersistGate>
                </Provider>
              </SafeAreaProvider>
            </TouchableWithoutFeedback>
          </PageProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default App;
