import { useState } from "react";
import { APP_TOKEN } from "src/constants/app.constants";
import { requestClan } from "src/services/request";
import {
  LoginDto,
  NetworkResponse,
  OTPDto,
  SignUpDto,
  UpdatePasswordDto,
} from "src/types/request.types";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import { useAppDispatch } from "../useReduxHooks";
import { populateUserData } from "src/services/redux/slices/auth";
import { OneSignal } from "react-native-onesignal";
import * as Notifications from "expo-notifications";
import IsEmail from "src/utils/isemail.utils";
import axios from "axios";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const updateReduxData = async (data: { username: string; token: string }) => {
    await SecureStoreManager.saveItemToSecureStore(
      `${APP_TOKEN}`,
      data?.token || "",
    );
    const { status } = await Notifications.requestPermissionsAsync();
    if (
      status === Notifications.PermissionStatus.GRANTED &&
      IsEmail(data.username)
    ) {
      try {
        OneSignal.login(data.username);
      } catch (error) {
        console.log("⚠️ OneSignal login error (not critical):", error);
      }
    }
    dispatch(populateUserData(data));
  };

  const signIn = async (
    data: LoginDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/signin`,
      type: "POST",
      data,
      toastTitle: "Authentication",
      isDefaultAuth: true,
    });
    cb();
    if (request?.code === 200) {
      updateReduxData(request.data);
    }
    setLoading(false);
    return request;
  };

  const checkJWT = async (cb = () => {}): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/checkjwt`,
      type: "GET",
      showToast: false,
    });
    cb();
    setLoading(false);
    return request;
  };

  const signUp = async (
    data: SignUpDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/signup`,
      type: "POST",
      data,
      toastTitle: "Create account",
      isDefaultAuth: true,
    });
    setLoading(false);
    cb();
    if (request.code === 201) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === Notifications.PermissionStatus.GRANTED && data.email) {
        try {
          OneSignal.login(data.email);
        } catch (error) {
          console.log("⚠️ OneSignal login error (not critical):", error);
        }
      }
    }
    return request;
  };

  const requestOTP = async (
    data: OTPDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/otp/request`,
      type: "POST",
      data,
      toastTitle: "Create account",
      isDefaultAuth: true,
    });
    setLoading(false);
    cb();
    return request;
  };

  const verifyOTP = async (
    data: OTPDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/otp/verify`,
      type: "POST",
      data,
      toastTitle: "Verify OTP",
      isDefaultAuth: true,
    });
    setLoading(false);
    cb();
    if (request.code === 200) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${request.data?.token}`;
    }
    return request;
  };

  const resetPassword = async (
    data: {
      password: string;
      confirmpassword: string;
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/reset/password`,
      type: "POST",
      data,
    });
    if (request?.code === 202) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${request.data?.token}`;
    }
    setLoading(false);
    cb();
    return request;
  };

  const changePassword = async (
    data: UpdatePasswordDto,
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/change/password`,
      type: "POST",
      data,
      toastTitle: "Change Password",
    });
    setLoading(false);
    cb();
    return request;
  };

  const updatePIN = async (
    data: {
      pin: string;
      password: string;
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request: NetworkResponse = await requestClan({
      route: `/auth/change/pin`,
      type: "POST",
      data,
      toastTitle: "Change PIN",
    });
    setLoading(false);
    cb();
    return request;
  };

  return {
    loading,
    signIn,
    updateReduxData,
    signUp,
    requestOTP,
    verifyOTP,
    changePassword,
    resetPassword,
    checkJWT,
    updatePIN,
  };
};

export default useAuth;
