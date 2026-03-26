import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "src/components/buttons.components";
import {
  colorPrimary,
  colorSuccess,
  colorWhite,
} from "src/constants/colors.constants";
import { JobObjectType } from "src/types/jobs.types";
import { useGetJobsApplicationsQuery } from "src/services/redux/apis";
import { TimeAgo } from "src/utils/app.utils";
import { useAppSelector } from "src/hooks/useReduxHooks";
import useJobs from "src/hooks/apis/useJobs";
import { formatCurrency } from "src/utils/numbers.utils";
import { useConnection } from "src/hooks/apis/useChat";
import { Icon } from "@rneui/themed";
import { useGetJobQuery } from "src/services/redux/apis/unauth.api.requests";

export default function JobViewScreen({
  navigation,
  route,
}: RootStackScreenProps<"JobViewScreen">) {
  const { loading: loading2, createConnection } = useConnection();
  const { profile } = useAppSelector((state) => state.auth.user);
  const { appliedIds, savedIds } = useAppSelector((state) => state.jobs);
  const [data, setData] = useState<JobObjectType>(route.params.data);
  const applied = appliedIds?.includes(data.id);
  const saved = savedIds?.includes(data.id);

  const { data: jobData, isFetching } = useGetJobQuery(data.id);
  const { loading, saveJob } = useJobs();
  const { isFetching: fetchingApplications, data: applicationData } =
    useGetJobsApplicationsQuery({
      jobid: `${data.id}`,
      profileid: `${profile.id}`,
    });

  useEffect(() => {
    if (jobData?.code === 200) setData(jobData?.data);
  }, [jobData]);

  const application = useMemo(() => {
    return applicationData?.data?.length > 0 ? applicationData?.data[0] : null;
  }, [applicationData]);

  const doSaveJob = async () => {
    await saveJob(data.id);
  };

  const doSendMessage = async (notification: any) => {
    const connection = await createConnection({
      connectionid: data?.profileid,
      waitforresponse: true,
    });
    if (connection.code === 201) {
      const connectionData = connection.data[0];
      navigation.navigate("MessagingScreen", {
        connectionstring: connectionData?.connectionstring,
        profile: {
          ...connectionData?.connection,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={layoutConstants.styles.rowView}>
          <Image
            source={require("src/assets/images/icons/nairaup-job-tag.jpg")}
            style={styles.jobTagImageStyle}
          />
          <Text ml={fontUtils.w(4)}>{data.company}</Text>
        </View>
        <Text
          mb={fontUtils.h(5)}
          mt={fontUtils.h(10)}
          fontFamily={fontUtils.manrope_semibold}
        >
          {data.role}
        </Text>
        <View
          style={[
            layoutConstants.styles.rowView,
            {
              flexWrap: "wrap",
            },
          ]}
        >
          <Text mr={fontUtils.w(10)} size={fontUtils.h(11)}>
            {`${data.city}${data.state ? `, ${data?.state}` : ""}`}
          </Text>
          <Ionicons name="ellipse" size={fontUtils.h(5)} />
          <Text
            ml={fontUtils.w(10)}
            mr={fontUtils.w(10)}
            size={fontUtils.h(11)}
            style={styles.modeTextStyle}
          >
            {data.workmode}
          </Text>
          <Ionicons name="ellipse" size={fontUtils.h(5)} />
          <Text
            ml={fontUtils.w(10)}
            mr={fontUtils.w(10)}
            size={fontUtils.h(11)}
            style={styles.modeTextStyle}
          >
            {data.worktype}
          </Text>
          <Ionicons name="ellipse" size={fontUtils.h(5)} />
          <Text ml={fontUtils.w(10)} size={fontUtils.h(11)}>
            {`Posted ${TimeAgo(data.createdat)}`}
          </Text>
        </View>
        <View style={layoutConstants.styles.rowView}>
          {!applied && profile.id !== data.profileid ? (
            <Button
              title={
                application !== null
                  ? `Applied ${TimeAgo(application?.createdat)}`
                  : "Apply now"
              }
              onPress={() =>
                navigation.navigate("JobApplyScreen", {
                  id: data.id,
                })
              }
              disabled={application !== null}
              buttonHeight={fontUtils.h(35)}
              mt={fontUtils.h(15)}
              titleStyle={styles.btnTitleStyle}
              backgroundColor={applied ? colorSuccess : undefined}
              wrapperStyle={{ flex: 1, marginRight: fontUtils.w(10) }}
            />
          ) : null}
          <Button
            title={saved ? "Saved" : "Save"}
            onPress={doSaveJob}
            loading={loading}
            disabled={saved}
            type="outline"
            buttonHeight={fontUtils.h(35)}
            mt={fontUtils.h(15)}
            titleStyle={styles.btnTitleStyle}
            buttonStyle={{
              paddingHorizontal: fontUtils.w(50),
            }}
          />
        </View>
        <Text
          mb={fontUtils.h(5)}
          mt={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_semibold}
        >
          Job Description
        </Text>
        <Text size={fontUtils.h(12)} lineHeight={fontUtils.h(18)}>
          {data.description}
        </Text>
        <Text
          mb={fontUtils.h(5)}
          mt={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_semibold}
        >
          Responsbilities and Requirements
        </Text>
        {data.requirements.map((r) => (
          <View
            key={r}
            style={[
              layoutConstants.styles.rowView,
              styles.responsibilityViewStyle,
            ]}
          >
            <Ionicons
              name="ellipse"
              size={fontUtils.h(5)}
              style={styles.bulletStyle}
            />
            <Text
              ml={fontUtils.w(4)}
              size={fontUtils.h(12)}
              lineHeight={fontUtils.h(18)}
            >
              {r}
            </Text>
          </View>
        ))}
        <Text
          mb={fontUtils.h(5)}
          mt={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_semibold}
        >
          Qualifications
        </Text>
        {data.qualifications.map((r) => (
          <View
            key={r}
            style={[
              layoutConstants.styles.rowView,
              styles.responsibilityViewStyle,
            ]}
          >
            <Ionicons
              name="ellipse"
              size={fontUtils.h(5)}
              style={styles.bulletStyle}
            />
            <Text
              ml={fontUtils.w(4)}
              size={fontUtils.h(12)}
              lineHeight={fontUtils.h(18)}
            >
              {r}
            </Text>
          </View>
        ))}
        <Text
          mb={fontUtils.h(5)}
          mt={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_semibold}
        >
          About the Company
        </Text>
        <Text size={fontUtils.h(12)} lineHeight={fontUtils.h(18)}>
          {data.aboutcompany}
        </Text>
        <Text
          mb={fontUtils.h(5)}
          mt={fontUtils.h(20)}
          fontFamily={fontUtils.manrope_semibold}
        >
          Salary Range
        </Text>
        <Text color={colorPrimary} size={fontUtils.h(9)}>
          {`N${formatCurrency(Number(data.minsalary))}${Number(data.maxsalary) > Number(data.minsalary)
              ? ` - ${formatCurrency(Number(data.maxsalary))}`
              : ""
            }`}
        </Text>
        <Button
          title={"   Contact Hiring Manager"}
          disabled={loading2}
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
          mt={fontUtils.h(20)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  jobTagImageStyle: {
    height: fontUtils.w(35),
    width: fontUtils.w(35),
  },
  btnTitleStyle: {
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(12),
  },
  responsibilityViewStyle: {
    marginBottom: fontUtils.h(10),
    alignItems: "flex-start",
  },
  bulletStyle: {
    marginTop: fontUtils.h(6),
  },
  modeTextStyle: {
    textTransform: "capitalize",
  },
  actionBtnTitleStyle: {
    fontFamily: fontUtils.manrope_medium,
    fontSize: fontUtils.h(12),
  },
});
