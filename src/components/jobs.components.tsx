import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { Button } from "./buttons.components";
import { Icon, Image, Text, TouchableOpacity } from "./themed.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import { useNavigation } from "@react-navigation/native";
import { JobObjectType } from "src/types/jobs.types";
import { TimeAgo } from "src/utils/app.utils";
import { shortenNumber } from "src/utils/numbers.utils";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { useGetJobsApplicationsQuery, useSaveJobMutation } from "src/services/redux/apis";

export const JobListingItem = memo(function JobListingItem(
  data: JobObjectType,
) {
  const [saveJob] = useSaveJobMutation();
  const { profile } = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation();
  const goToJob = () =>
    navigation.navigate("JobViewScreen", {
      data,
    });
  const { data: applicationData } = useGetJobsApplicationsQuery({
    jobid: `${data.id}`,
    profileid: `${profile.id}`,
  });

  const application = useMemo(() => {
    return applicationData?.data?.length > 0 ? applicationData?.data[0] : null;
  }, [applicationData]);

  return (
    <View style={[styles.listingViewStyle]}>
      <View style={[styles.sectionViewStyle, styles.topViewStyle]}>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <View style={[layoutConstants.styles.rowView]}>
            <Image
              source={require("src/assets/images/icons/nairaup-job-tag.jpg")}
              style={styles.jobTagImageStyle}
            />
            <View style={styles.companyNameViewStyle}>
              <Text
                size={fontUtils.h(10)}
                fontFamily={fontUtils.manrope_semibold}
                numberOfLines={1}
              >
                {data.company}
              </Text>
              <Text numberOfLines={1} size={fontUtils.h(10)}>{`${data.city}${data.state ? `, ${data?.state}` : ""
                }`}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={async () => {
              try {
                const res = await saveJob({ jobid: `${data.id}` }).unwrap();
                if (res.code === 200 || res.code === 201) {
                  // Success toast handled by requestClan usually, but we can add more if needed.
                }
              } catch (error) {
                console.log("Error saving job:", error);
              }
            }}
          >
            <Image
              source={require("src/assets/images/icons/stash_save-ribbon.png")}
              style={styles.ribbonStyle}
              wrapperStyle={styles.ribbontWrapperStyle}
            />
          </TouchableOpacity>
        </View>
        <Text
          mt={fontUtils.h(10)}
          mb={fontUtils.h(5)}
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_bold}
          numberOfLines={2}
        >
          {data.role}
        </Text>
        <View style={[layoutConstants.styles.rowView, styles.tagsViewStyle]}>
          {[data.workmode, data.worktype].map((t) => (
            <TouchableOpacity style={styles.tagViewStyle} key={t}>
              <Text style={styles.jobModeStyle} size={fontUtils.h(9)}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text color={"#34A853"} size={fontUtils.h(9)}>
          {`Posted ${TimeAgo(data.createdat)}`}
        </Text>
      </View>
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyContentBetween,
          styles.sectionViewStyle,
          styles.bottomViewStyle,
        ]}
      >
        <Text size={fontUtils.h(10)} fontFamily={fontUtils.manrope_bold}>
          {`N${shortenNumber(data.minsalary)}${Number(data.maxsalary) > Number(data.minsalary)
            ? ` - ${shortenNumber(data.maxsalary)}`
            : ""
            }`}
        </Text>
        <Button
          title={application !== null ? "Applied" : "Apply"}
          onPress={goToJob}
          buttonHeight={fontUtils.h(28)}
          titleStyle={styles.btnTitleStyle}
          buttonStyle={styles.btnStyle}
        />
      </View>
    </View>
  );
});

export const JobListingHorizontalItem = memo(function JobListingHorizontalItem(
  data: JobObjectType & {
    featured?: boolean;
  },
) {
  const { token } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.auth.user);
  const { appliedIds, appliedJobs } = useAppSelector((state) => state.jobs);
  const applied = appliedIds.includes(data.id);
  const { featured } = data;
  const navigation = useNavigation();
  const goToJob = () =>
    !token
      ? navigation.navigate("LoginScreen")
      : navigation.navigate("JobViewScreen", {
        data,
      });

  return (
    <TouchableOpacity
      style={[styles.horizontalListingViewStyle]}
      onPress={goToJob}
    >
      <Image
        source={require("src/assets/images/icons/nairaup-job-tag.jpg")}
        style={styles.jobTagImageStyle}
      />
      <View style={styles.mainContentStyle}>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <Text
            numberOfLines={1}
            size={fontUtils.h(12)}
            fontFamily={fontUtils.manrope_medium}
          >
            {data.role}
          </Text>
          {featured ? (
            profile.id !== data.id ? (
              <Icon name="close-circle" size={fontUtils.h(18)} type="ionicon" />
            ) : (
              <Text size={fontUtils.h(8)} color={colorPrimary}>
                Featured
              </Text>
            )
          ) : null}
        </View>
        <Text size={fontUtils.h(10)}>{data.company}</Text>
        <Text size={fontUtils.h(9)} mb={fontUtils.h(5)}>
          {`${data.city}${data.state ? `, ${data?.state}` : ""}`}
        </Text>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          {featured || applied ? (
            <Text color={colorPrimary} size={fontUtils.h(9)}>
              {`N${shortenNumber(data.minsalary)}${Number(data.maxsalary) > Number(data.minsalary)
                ? ` - ${shortenNumber(data.maxsalary)}`
                : ""
                }`}
            </Text>
          ) : null}
          {!applied ? (
            <Text color="#34A853" size={fontUtils.h(9)}>
              {`Posted ${TimeAgo(data.createdat)}`}
            </Text>
          ) : null}
          {!featured && !applied && profile.id !== data.profileid ? (
            <Button
              title={"Apply now"}
              onPress={goToJob}
              buttonHeight={fontUtils.h(26)}
              titleStyle={styles.btnTitleStyle}
              buttonStyle={styles.btnStyle}
            />
          ) : null}
          {applied ? (
            <Text size={fontUtils.h(9)}>{`Applied ${TimeAgo(
              //@ts-ignore
              appliedJobs[data.id]?.applicationdate,
            )}`}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  horizontalListingViewStyle: {
    marginBottom: fontUtils.h(12),
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(4, 82, 192, 0.2)",
    paddingVertical: fontUtils.w(10),
    paddingHorizontal: fontUtils.w(10),
    borderRadius: fontUtils.r(10),
    flexDirection: "row",
  },
  mainContentStyle: {
    flex: 1,
    marginLeft: fontUtils.w(8),
  },
  listingViewStyle: {
    width: fontUtils.w(157),
    borderRadius: fontUtils.r(16),
    overflow: "hidden",
    marginRight: fontUtils.w(20),
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(4, 82, 192, 0.2)",
    backgroundColor: "#F1F7FF",
  },
  companyNameViewStyle: {
    flex: 1,
    marginRight: fontUtils.w(5),
  },
  btnTitleStyle: {
    fontSize: fontUtils.h(8),
  },
  btnStyle: {
    paddingHorizontal: fontUtils.w(15),
  },
  sectionViewStyle: {
    paddingHorizontal: fontUtils.w(6),
  },
  bottomViewStyle: {
    paddingVertical: fontUtils.h(10),
    backgroundColor: colorWhite,
  },
  ribbonStyle: {
    height: fontUtils.w(20),
    width: fontUtils.w(20),
  },
  ribbontWrapperStyle: {
    width: fontUtils.h(24),
    height: fontUtils.h(24),
    borderRadius: fontUtils.h(24),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorWhite,
  },
  topViewStyle: {
    paddingVertical: fontUtils.h(5),
  },
  jobTagImageStyle: {
    height: fontUtils.w(24),
    width: fontUtils.w(24),
    marginRight: fontUtils.w(5),
  },
  tagViewStyle: {
    paddingHorizontal: fontUtils.w(5),
    paddingVertical: fontUtils.h(3),
    marginRight: fontUtils.w(5),
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: fontUtils.r(4),
  },
  tagsViewStyle: {
    flexWrap: "wrap",
    marginBottom: fontUtils.h(5),
  },
  jobModeStyle: {
    textTransform: "capitalize",
  },
});
