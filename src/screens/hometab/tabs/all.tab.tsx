import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { ScrollView, Text } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ApartmentListingItem } from "src/components/apartments.components";
import { JobListingItem } from "src/components/jobs.components";
import { useGetProvidersQuery } from "src/services/redux/apis";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { PropertyObjectType } from "src/types/properties.types";
import { JobObjectType } from "src/types/jobs.types";
import {
  useGetPropertiesQuery,
  useGetJobsQuery,
} from "src/services/redux/apis/unauth.api.requests";

const HORIZONTAL_LIST_HEIGHT = fontUtils.h(235);
const ItemSeparator = () => <View style={{ width: fontUtils.w(16) }} />;

export default function AllTabScreen({
  navigation,
  route,
}: RootStackScreenProps<"HomeTabNavigator">) {
  const {
    isFetching,
    data: propertiesData,
    refetch,
  } = useGetPropertiesQuery({
    type: "apartment",
    status: "listed",
  });

  const {
    isFetching: fetchingFiveStars,
    data: fiveStarHotels,
    refetch: refetchFiveStars,
  } = useGetPropertiesQuery({
    averagerating: "3,5",
    type: "hotel",
    status: "listed",
  });

  const {
    isFetching: fetchingShortlets,
    data: shortletsData,
    refetch: refetchShortlets,
  } = useGetPropertiesQuery({
    type: "shortlet",
    status: "listed",
  });

  const {
    isFetching: fetchingJobs,
    data: jobsData,
    refetch: refetchJobs,
  } = useGetJobsQuery({});

  const {
    isFetching: fetchingProviders,
    data: providersData,
    refetch: refetchProviders,
  } = useGetProvidersQuery({});

  const renderApartments = useCallback(
    ({ item, index }: { item: PropertyObjectType; index: number }) => (
      <ApartmentListingItem {...item} />
    ),
    [],
  );

  const renderJobs = useCallback(
    ({ item, index }: { item: JobObjectType; index: number }) => (
      <JobListingItem {...item} />
    ),
    [],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: layoutConstants.tabBarHeight,
      }}
      nestedScrollEnabled={false}
    >
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
      >
        Popular Apartments
      </Text>
      <View style={{ height: HORIZONTAL_LIST_HEIGHT }}>
        <FlatList
          data={propertiesData?.data || []}
          renderItem={renderApartments}
          refreshControl={
            <AppRefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          ItemSeparatorComponent={ItemSeparator}
          horizontal
          scrollEnabled={true}
        />
      </View>
      {fiveStarHotels?.data?.length > 0 ? (
        <Text
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
          mt={fontUtils.h(30)}
        >
          5-star Hotels near you
        </Text>
      ) : null}
      <View style={{ height: HORIZONTAL_LIST_HEIGHT }}>
        <FlatList
          data={fiveStarHotels?.data || []}
          renderItem={renderApartments}
          refreshControl={
            <AppRefreshControl
              refreshing={fetchingFiveStars}
              onRefresh={refetchFiveStars}
            />
          }
          ItemSeparatorComponent={ItemSeparator}
          horizontal
          scrollEnabled={true}
        />
      </View>
      {shortletsData?.data?.length > 0 ? (
        <Text
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
          mt={fontUtils.h(30)}
        >
          Shortlets around you
        </Text>
      ) : null}
      <View style={{ height: HORIZONTAL_LIST_HEIGHT }}>
        <FlatList
          data={shortletsData?.data || []}
          renderItem={renderApartments}
          refreshControl={
            <AppRefreshControl
              refreshing={fetchingShortlets}
              onRefresh={refetchShortlets}
            />
          }
          ItemSeparatorComponent={ItemSeparator}
          horizontal
          scrollEnabled={true}
        />
      </View>
      {/* <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
        mt={fontUtils.h(30)}
      >
        Service Providers near you
      </Text>
      <FlatList
        data={providersData?.data || []}
        renderItem={renderProviders}
        refreshControl={
          <AppRefreshControl
            refreshing={fetchingProviders}
            onRefresh={refetchProviders}
          />
        }
        horizontal
      /> */}
      {/* <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
        mt={fontUtils.h(30)}
      >
        Jobs for you
      </Text>
      <FlatList
        data={jobsData?.data || []}
        renderItem={renderJobs}
        refreshControl={
          <AppRefreshControl
            refreshing={fetchingJobs}
            onRefresh={refetchJobs}
          />
        }
        horizontal
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: fontUtils.h(20),
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  apartmentItemViewStyle: {},
});
