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
    cb = () => { },
  ): Promise<NetworkResponse | null> => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
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
      console.log("Google Sign-In Error Object:", JSON.stringify(error, null, 2));
      // console.log("Google Sign-In Error Message:", error?.message);
      if (isErrorWithCode(error)) {
        console.log("Google Sign-In Error Code:", error.code);
        let errorMsg = "";
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            errorMsg = "Sign-in was cancelled";
            break;
          case statusCodes.IN_PROGRESS:
            errorMsg = "Login is currently in progress";
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMsg = "Google Play Services not available or outdated";
            break;
          case "10": // DEVELOPER_ERROR
            errorMsg = "Configuration error (check SHA-1 and package name in Google Console)";
            console.error("DEVELOPER_ERROR (10): This usually means the SHA-1 fingerprint or package name does not match what is registered in the Google Cloud Console.");
            break;
          default:
            errorMsg = `Google sign-in failed (Code: ${error.code})`;
            break;
        }
        Toast.show({
          type: "error",
          text1: "Authentication Error",
          text2: errorMsg || "Unknown error occurred",
        });
      } else {
        console.log("Google Sign-In Exception:", error);
        Toast.show({
          type: "error",
          text1: "Sign-In Error",
          text2: "An unexpected error occurred during Google Sign-In.",
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};
