import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
} from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ApartmentListingItem } from "src/components/apartments.components";
import { JobListingItem } from "src/components/jobs.components";
import { useAppSelector } from "src/hooks/useReduxHooks";
import {
  useGetSavedJobsQuery,
  useGetSavedPropertiesQuery,
} from "src/services/redux/apis";
import { JobObjectType } from "src/types/jobs.types";

export default function SavedItemsScreen({
  navigation,
  route,
}: RootStackScreenProps<"SavedItemsScreen">) {
  const { theme } = useAppTheme();

  const { id } = useAppSelector((state) => state.auth.user.profile);

  const { data: apartments } = useGetSavedPropertiesQuery({
    "property.type": "apartment",
    profileid: `${id}`,
  });

  const { data: hotels } = useGetSavedPropertiesQuery({
    "property.type": "hotel",
    profileid: `${id}`,
  });

  const {
    data: jobsData,
    isFetching,
    refetch,
  } = useGetSavedJobsQuery({
    profileid: `${id}`,
  });

  const renderJob = useCallback(
    ({
      item,
      index,
    }: {
      item: {
        jobpost: JobObjectType;
      };
      index: number;
    }) => {
      const job = item?.jobpost;
      return <JobListingItem {...job} />;
    },
    [],
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView>
        <Text
          mt={fontUtils.h(15)}
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
        >
          Hotels
        </Text>
        <FlatList
          data={hotels?.data || []}
          renderItem={({ item, index }) => (
            <ApartmentListingItem {...item?.property} />
          )}
          horizontal
        />
        <Text
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
          mt={fontUtils.h(20)}
        >
          Apartments
        </Text>
        <FlatList
          data={apartments?.data || []}
          renderItem={({ item, index }) => (
            <ApartmentListingItem {...item?.property} />
          )}
          horizontal
        />
        <Text
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
          mt={fontUtils.h(20)}
        >
          Jobs
        </Text>
        <FlatList
          data={jobsData?.data || []}
          renderItem={renderJob}
          horizontal
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
