import { RenderProps } from "src/types/navigation.types";
import { ReduxAuthState } from "src/types/app.types";
import OnboardingIntroScreen from "src/screens/onboarding/intro.screen";
import LoginScreen from "src/screens/auth/login.screen";
import CreateAccountScreen from "src/screens/auth/createaccount.screen";
import OTPVerificationScreen from "src/screens/auth/otp.verification.screen";
import { ScreenHeader } from "src/components/headers.components";
import React from "react";
import AccountSuccessScreen from "src/screens/auth/account.success.screen";
import { BottomTabNavigator } from "src/navigation/bottomtab.navigator";
import ApartmentViewScreen from "src/screens/apartments/apartment.view.screen";
import ProviderViewScreen from "src/screens/services/provider.view.screen";
import { colorWhite } from "./colors.constants";
import fontUtils from "src/utils/font.utils";
import ProviderAroundScreen from "src/screens/services/providers.around.screen";
import HotelViewScreen from "src/screens/hotels/hotel.view.screen";
import HotelReserveScreen from "src/screens/hotels/hotel.reserve.screen";
import HotelReserveSuccessScreen from "src/screens/hotels/hotel.reserve.success.screen";
import JobViewScreen from "src/screens/jobs/job.view.screen";
import JobApplyScreen from "src/screens/jobs/job.apply.screen";
import SettingsScreen from "src/screens/settings";
import ProfileEditScreen from "src/screens/settings/profile.edit.screen";
import SavedItemsScreen from "src/screens/settings/items.saved.screen";
import AllJobsScreen from "src/screens/settings/jobs.all.screen";
import PasswordEditScreen from "src/screens/settings/password.edit.screen";
import AllPurchasesScreen from "src/screens/settings/purchases.all.screen";
import MessagingScreen from "src/screens/chat/messaging.screen";
import ChatListScreen from "src/screens/chat";
import ApartmentCreateScreen from "src/screens/apartments/apartment.create.screen";
import ApartmentCreateNextScreen from "src/screens/apartments/apartment.create.next.screen";
import { Text } from "src/components/themed.components";
import ApartmentCreateDocsScreen from "src/screens/apartments/apartment.create.docs.screen";
import JobCreateNextScreen from "src/screens/jobs/job.create.screen";
import ForgotPasswordScreen from "src/screens/auth/forgotpassword.screen";
import { ApartmentScreenHeader } from "src/screens/apartments/components/header.component";
import ApartmentSoldScreen from "src/screens/apartments/apartment.sold.screen";
import ApartmentRateBuyerScreen from "src/screens/apartments/apartment.buyer.rate.screen";
import ApartmentRoomsAddScreen from "src/screens/apartments/apartment.rooms.add.screen";
import ResetPasswordScreen from "src/screens/auth/resetpassword.screen";
import SavedJobsScreen from "src/screens/settings/jobs.saved.screen";
import AppliedJobsScreen from "src/screens/settings/jobs.applied.screen";
import ApartmentEditScreen from "src/screens/apartments/apartment.edit.screen";
import HotelReservationViewScreen from "src/screens/hotels/hotel.reservation.view.screen";
import ReviewsScreen from "src/screens/profiletab/reviews.screen";
import TransactionsScreen from "src/screens/transactions";
import HomeTabScreen from "src/screens/hometab";
import PasswordSecurityScreen from "src/screens/settings/password.security.screen";
import AccountManagementScreen from "src/screens/settings/account.management.screen";
import PinEditScreen from "src/screens/settings/pin.edit.screen";
import HelpCenterScreen from "src/screens/settings/help.screen";

export const CommonRoutes: RenderProps[] = [
  {
    name: "OnboardingIntroScreen",
    component: OnboardingIntroScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "HotelViewScreen",
    component: HotelViewScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "ApartmentViewScreen",
    component: ApartmentViewScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        //@ts-ignore
        <ApartmentScreenHeader property={route?.params?.data} />
      ),
    },
  },
];

export const AuthRoutes: RenderProps[] = [
  {
    name: "AppBeforeAuth",
    component: HomeTabScreen,
    options: {
      // headerShown: false,
      title: "NairaUp",
      headerBackVisible: false,
    },
    initialParams: {},
  },
  {
    name: "LoginScreen",
    component: LoginScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "ForgotPasswordScreen",
    component: ForgotPasswordScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "ResetPasswordScreen",
    component: ResetPasswordScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "CreateAccountScreen",
    component: CreateAccountScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "OTPVerificationScreen",
    component: OTPVerificationScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} />,
    },
  },
  {
    name: "AccountSuccessScreen",
    component: AccountSuccessScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  ...CommonRoutes,
];

export const UserRoutes: RenderProps[] = [
  {
    name: "App",
    component: BottomTabNavigator,
    options: {
      headerShown: false,
    },
    initialParams: {},
  },
  {
    name: "ApartmentEditScreen",
    component: ApartmentEditScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader backBtnTitle="Edit Property" title={""} />
      ),
    },
  },
  {
    name: "ApartmentSoldScreen",
    component: ApartmentSoldScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} />,
    },
  },
  {
    name: "ApartmentRateBuyerScreen",
    component: ApartmentRateBuyerScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="Ratings" />,
    },
  },
  {
    name: "ProviderViewScreen",
    component: ProviderViewScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "ProviderAroundScreen",
    component: ProviderAroundScreen,
    initialParams: {
      providerType: "Providers",
    },
    options: {
      header: ({ route }) => (
        <ScreenHeader
          //@ts-ignore
          backBtnTitle={`${route.params?.providerType} around you`}
        />
      ),
    },
  },
  {
    name: "HotelReserveScreen",
    component: HotelReserveScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} />,
    },
  },
  {
    name: "HotelReserveSuccessScreen",
    component: HotelReserveSuccessScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "JobViewScreen",
    component: JobViewScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} />,
    },
  },
  {
    name: "JobApplyScreen",
    component: JobApplyScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={"Apply to NairaUp"} />,
    },
  },
  {
    name: "SettingsScreen",
    component: SettingsScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="Settings" />,
    },
  },
  {
    name: "ProfileEditScreen",
    component: ProfileEditScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "SavedItemsScreen",
    component: SavedItemsScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="All Saved Items" />,
    },
  },
  {
    name: "AllJobsScreen",
    component: AllJobsScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="All Jobs" />,
    },
  },
  {
    name: "SavedJobsScreen",
    component: SavedJobsScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="Saved Jobs" />,
    },
  },
  {
    name: "AppliedJobsScreen",
    component: AppliedJobsScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="Applied Jobs" />,
    },
  },
  {
    name: "PasswordEditScreen",
    component: PasswordEditScreen,
    initialParams: {},
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="Edit Password" />,
    },
  },
  {
    name: "PinEditScreen",
    component: PinEditScreen,
    initialParams: {},
    options: {
      header: () => (
        <ScreenHeader title={""} backBtnTitle="Update Security PIN" />
      ),
    },
  },
  {
    name: "AllPurchasesScreen",
    component: AllPurchasesScreen,
    initialParams: {},
    options: {
      header: () => (
        <ScreenHeader title={""} backBtnTitle="All Purchased Items" />
      ),
    },
  },
  {
    name: "MessagingScreen",
    component: MessagingScreen,
    initialParams: {},
    options: {
      headerShown: false,
    },
  },
  {
    name: "ChatListScreen",
    component: ChatListScreen,
    initialParams: {},
    options: {
      header: () => (
        <ScreenHeader
          title={""}
          titleColor={colorWhite}
          backBtnTitle="Chats"
          containerStyle={{
            backgroundColor: "#006089",
          }}
        />
      ),
    },
  },
  {
    name: "ApartmentCreateScreen",
    component: ApartmentCreateScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader
          title={""}
          backBtnTitle={
            //@ts-ignore
            route.params.type === "job"
              ? "Create Job Listing"
              : //@ts-ignore
                route.params.type === "apartment"
                ? "Create Apartment Listing"
                : "Create Hotel Listing"
          }
        />
      ),
    },
  },
  {
    name: "ApartmentCreateNextScreen",
    component: ApartmentCreateNextScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader
          title={""}
          backBtnTitle={
            //@ts-ignore
            route.params.type === "apartment"
              ? "Create Apartment Listing"
              : "Create Hotel Listing"
          }
          rightComponent={
            <Text size={fontUtils.h(10)} fontFamily={fontUtils.manrope_light}>
              1/2
            </Text>
          }
        />
      ),
    },
  },
  {
    name: "ApartmentRoomsAddScreen",
    component: ApartmentRoomsAddScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader
          title={""}
          backBtnTitle={
            //@ts-ignore
            `Add rooms to ${route.params?.title}`
          }
        />
      ),
    },
  },
  {
    name: "ApartmentCreateDocsScreen",
    component: ApartmentCreateDocsScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader
          title={""}
          backBtnTitle={
            //@ts-ignore
            route === "apartment"
              ? "Create Apartment Listing"
              : "Create Hotel Listing"
          }
          rightComponent={
            <Text size={fontUtils.h(10)} fontFamily={fontUtils.manrope_light}>
              2/2
            </Text>
          }
        />
      ),
    },
  },
  {
    name: "JobCreateNextScreen",
    component: JobCreateNextScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader title={""} backBtnTitle={"Create Job Listing"} />
      ),
    },
  },
  {
    name: "HotelReservationViewScreen",
    component: HotelReservationViewScreen,
    initialParams: {},
    options: {
      header: ({ route }) => <ScreenHeader title={""} backBtnTitle={"Back"} />,
    },
  },
  {
    name: "ReviewsScreen",
    component: ReviewsScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader title={""} backBtnTitle={"Reviews"} />
      ),
    },
  },
  {
    name: "PasswordSecurityScreen",
    component: PasswordSecurityScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader title={""} backBtnTitle={"Security"} />
      ),
    },
  },
  {
    name: "AccountManagementScreen",
    component: AccountManagementScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader title={""} backBtnTitle={"Account Management"} />
      ),
    },
  },                                              
  {
    name: "TransactionsScreen",
    component: TransactionsScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader title={""} backBtnTitle={"Transactions"} />
      ),
    },
  },
  {
    name: "HelpCenterScreen",
    component: HelpCenterScreen,
    initialParams: {},
    options: {
      header: ({ route }) => (
        <ScreenHeader title={""} backBtnTitle={"Help Center"} />
      ),
    },
  },
  ...CommonRoutes,
];

export const AppRoutes = (auth: ReduxAuthState, loggedOut?: boolean) => {
  if (loggedOut) return AuthRoutes;
  if (auth.token && auth.user.id && auth.user.id > 0) return UserRoutes;
  return AuthRoutes;
};
