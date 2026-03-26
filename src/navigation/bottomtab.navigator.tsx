import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RenderProps, RootTabParamList } from "src/types/navigation.types";
import colorsConstants, { colorPrimary } from "src/constants/colors.constants";
import { useAppTheme } from "src/providers/theme.provider";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import {
  ExploreTabRoutes,
  HomeTabRoutes,
  NotificationsTabRoutes,
  ProfileTabRoutes,
} from "src/constants/tabs.routes.constants";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { showCreatePostModal } from "src/components/post.create.modal";
import {
  reduxApiRequests,
  useGetJobsApplicationsQuery,
  useGetNotificationsCountQuery,
  useGetSavedJobsQuery,
} from "src/services/redux/apis";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import { saveAppliedJobs, saveSavedJobs } from "src/services/redux/slices/jobs";
import useAuth from "src/hooks/apis/useAuth";
import { logout } from "src/services/redux/slices/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTab = createBottomTabNavigator<RootTabParamList>();
const InTabStack = createNativeStackNavigator();

function renderTabsScreen({
  name,
  component,
  options = {},
  initialParams = {},
}: RenderProps) {
  return (
    <InTabStack.Screen
      name={name}
      key={name}
      options={options}
      component={component}
      initialParams={initialParams}
    />
  );
}

function HomeTabNavigator() {
  return (
    <InTabStack.Navigator>
      {HomeTabRoutes.map((route) => {
        return renderTabsScreen(route);
      })}
    </InTabStack.Navigator>
  );
}

function ExploreTabNavigator() {
  return (
    <InTabStack.Navigator>
      {ExploreTabRoutes.map((route) => {
        return renderTabsScreen(route);
      })}
    </InTabStack.Navigator>
  );
}

function NotificationsTabNavigator() {
  return (
    <InTabStack.Navigator>
      {NotificationsTabRoutes.map((route) => {
        return renderTabsScreen(route);
      })}
    </InTabStack.Navigator>
  );
}

function ProfileTabNavigator() {
  return (
    <InTabStack.Navigator>
      {ProfileTabRoutes.map((route) => {
        return renderTabsScreen(route);
      })}
    </InTabStack.Navigator>
  );
}

export function BottomTabNavigator() {
  const { profile } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const tabBarIconSize = fontUtils.h(18);
  const { theme } = useAppTheme();

  const { checkJWT } = useAuth();

  const { data: notificationCountData } = useGetNotificationsCountQuery({
    status: "pending",
    profileid: `${profile.id}`,
  });
  const pendingCount = notificationCountData?.data?.count ?? 0;

  React.useEffect(() => {
    checkJWT().then((r) => {
      if (r.code !== 200) dispatch(logout());
    });
  }, []);

  const { data: jobsData } = useGetJobsApplicationsQuery({
    profileid: `${profile.id}`,
  });
  const { data: savedDJobsData } = useGetSavedJobsQuery({
    profileid: `${profile.id}`,
  });

  useEffect(() => {
    dispatch(
      reduxApiRequests.endpoints.getJobsApplications.initiate(
        {
          profileid: `${profile.id}`,
        },
        {
          forceRefetch: true,
          subscribe: true,
        },
      ),
    );
    dispatch(
      reduxApiRequests.endpoints.getSavedJobs.initiate(
        {
          profileid: `${profile.id}`,
        },
        {
          forceRefetch: true,
          subscribe: true,
        },
      ),
    );
  }, []);

  useEffect(() => {
    const _jobsData = jobsData?.data || [];
    const jobIds = [];
    const jobs = {};
    for (const job of _jobsData) {
      const jobid = job.jobid;
      jobIds.push(jobid);
      Object.assign(jobs, {
        [jobid]: {
          ...job.jobpost,
          applicationdate: job?.createdat,
        },
      });
    }
    dispatch(saveAppliedJobs({ ids: jobIds, jobs }));
  }, [jobsData]);

  useEffect(() => {
    const _jobsData = savedDJobsData?.data || [];
    const jobIds = _jobsData?.map((r: any) => r?.jobid);
    dispatch(saveSavedJobs(jobIds));
  }, [savedDJobsData]);

  return (
    <BottomTab.Navigator
      initialRouteName="HomeTabNavigator"
      backBehavior="history"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colorPrimary,
        tabBarInactiveTintColor: colorsConstants[theme].text,
        // tabBarInactiveTintColor: colorsConstants[theme].tabBarInactiveTintColor,
        tabBarActiveBackgroundColor: colorsConstants[theme].screenGb,
        headerShown: false,
        tabBarStyle: {
          height:
            //@ts-ignore
            layoutConstants?.tabBarHeight +
            (Platform.OS === "android" ? insets.bottom : 0),
          backgroundColor: colorsConstants[theme].screenGb,
        },
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}
    >
      <BottomTab.Screen
        name="HomeTabNavigator"
        component={HomeTabNavigator}
        options={({ navigation }) => ({
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Octicons name="home-fill" size={fontUtils.h(15)} color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="ExploreTabNavigator"
        component={ExploreTabNavigator}
        options={({ navigation }) => ({
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <Feather name="search" size={fontUtils.h(15)} color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="PostTabNavigator"
        component={NotificationsTabNavigator}
        options={({ navigation }) => ({
          tabBarLabel: "Post",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="plus-box"
              size={fontUtils.h(17)}
              color={color}
            />
          ),
        })}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            showCreatePostModal();
          },
        }}
      />
      <BottomTab.Screen
        name="NotificationsTabNavigator"
        component={NotificationsTabNavigator}
        options={({ navigation }) => ({
          tabBarLabel: "Notifications",
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="notifications"
              size={fontUtils.h(15)}
              color={color}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="ProfileTabNavigator"
        component={ProfileTabNavigator}
        options={({ navigation }) => ({
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Octicons name="feed-person" size={fontUtils.h(15)} color={color} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontFamily: fontUtils.manrope_semibold,
    fontSize: fontUtils.h(10),
  },
  tabBarItemViewStyle: {},
});
