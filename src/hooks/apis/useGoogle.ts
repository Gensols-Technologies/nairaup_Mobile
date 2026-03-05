import { useState } from "react";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { requestClan } from "src/services/request";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import { APP_EXPO_PUSH_TOKEN } from "src/constants/app.constants";
import useAuth from "./useAuth";
import { NetworkResponse } from "src/types/request.types";
import { Toast } from "toastify-react-native";

export const useGoogle = () => {
  const [loading, setLoading] = useState(false);
  const { updateReduxData } = useAuth();
  const signInWithGoogle = async (
    cb = () => {},
  ): Promise<NetworkResponse | null> => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let pushnotificationtoken =
        (await SecureStoreManager.getItemFromSecureStore(
          `${APP_EXPO_PUSH_TOKEN}`,
        )) || "";
      
      // Validate push token - if it's an error message, use empty string
      if (pushnotificationtoken.includes("Error") || pushnotificationtoken.includes("not initialized")) {
        pushnotificationtoken = "";
      }
      
      const request: NetworkResponse = await requestClan({
        route: `/auth/google`,
        type: "POST",
        data: {
          firstname: userInfo.data?.user.givenName?.split(" ")[0],
          lastname: userInfo.data?.user.familyName,
          email: userInfo.data?.user.email,
          id: userInfo.data?.user.id,
          avataruri: userInfo?.data?.user?.photo,
          pushnotificationtoken,
          thirdparty: "google",
        },
        isDefaultAuth: true,
      });
      setLoading(false);
      cb();
      if (request?.code === 200) {
        updateReduxData(request?.data);
      }
      return request;
    } catch (error) {
      console.log(error);
      if (isErrorWithCode(error)) {
        let errorMsg = "";
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            errorMsg = "Cancelled";
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            errorMsg = "Signin in progress";
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMsg = "Play service is not available";
            // play services not available or outdated
            break;
          default:
            break;
        }
        Toast.show({
          type: "error",
          text1: "Google Authentication",
          text2: errorMsg || "Unknown error occured",
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};
