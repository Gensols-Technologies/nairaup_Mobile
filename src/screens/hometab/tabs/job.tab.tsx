import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { ScrollView, Text } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { Input, SelectInput } from "src/components/inputs.components";
import { Feather } from "@expo/vector-icons";
import { JobListingHorizontalItem } from "src/components/jobs.components";
import { Button } from "src/components/buttons.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import { JobObjectType } from "src/types/jobs.types";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useDebounce } from "use-debounce";
import { PAGE_FILTERS, PRICE_RANGES } from "src/constants/app.constants";
import {
  useGetJobsQuery,
  useGetJobTypesAndModesQuery,
} from "src/services/redux/apis/unauth.api.requests";
import { CITIES_IN_NIGERIA } from "src/constants/location.constants";
import {
  useGetCitiesQuery,
  useGetStatesQuery,
} from "src/services/redux/apis/countries.api.requests";

export default function JobsTabScreen({
  navigation,
  route,
  withSearch = true,
}: RootStackScreenProps<"HomeTabNavigator" | "ExploreTabNavigator"> & {
  withSearch?: boolean;
}) {
  const [searchText, setSearchText] = useState("");
  const [pageFilter, setPageFilter] = useState("jobs");
  const [searchValue] = useDebounce(searchText, 1000);
  const [worktype, setWorkType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("2901");
  const [range, setRange] = useState("");

  const { isLoading: loadingStates, data: statesData } = useGetStatesQuery({
    countryid: "158",
  });
  const { isFetching: fetchingCities, data: citiesData } = useGetCitiesQuery({
    stateid: state,
  });

  const { data: jobTypesAndModesData, isLoading: loadingTypes } =
    useGetJobTypesAndModesQuery(null);

  const jobTypes = useMemo(() => {
    return jobTypesAndModesData?.data?.types || [];
  }, [jobTypesAndModesData]);

  const { isFetching, data, refetch } = useGetJobsQuery({
    role: searchValue !== "" ? searchValue : undefined,
    featured: 0,
    //@ts-ignore
    worktype: worktype !== "" ? worktype : undefined,
    minsalary: range !== "" ? range : undefined,
    city: city.length > 0 ? city : undefined,
  });

  const {
    isFetching: fetchingFeatured,
    data: featuredJobs,
    refetch: fetchFeatured,
  } = useGetJobsQuery({
    role: searchValue !== "" ? searchValue : undefined,
    featured: 1,
    //@ts-ignore
    worktype: worktype !== "" ? worktype : undefined,
    minsalary: range !== "" ? range : undefined,
    city: city !== "" ? city : undefined,
  });

  const onRefresh = () => {
    refetch();
    fetchFeatured();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <AppRefreshControl
          refreshing={isFetching || fetchingFeatured}
          onRefresh={onRefresh}
        />
      }
    >
      {withSearch ? (
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for jobs"
          leftIcon={
            <Feather
              name="search"
              style={{ marginLeft: fontUtils.w(15) }}
              size={fontUtils.h(20)}
              color={"rgba(0, 0, 0, 0.5)"}
            />
          }
          inputHeight={fontUtils.h(40)}
          rightIcon={
            isFetching || fetchingFeatured ? (
              <ActivityIndicator color={colorPrimary} />
            ) : undefined
          }
        />
      ) : (
        <View>
          <View style={styles.headerViewStyle}>
            <View
              style={[
                layoutConstants.styles.rowView,
                layoutConstants.styles.justifyContentBetween,
              ]}
            >
              <Text
                fontFamily={fontUtils.manrope_semibold}
                size={fontUtils.h(15)}
              >
                Explore
              </Text>

              <SelectInput
                items={PAGE_FILTERS}
                value={pageFilter}
                onSelectItem={(e: any) => setPageFilter(e?.value)}
                placeholder="Jobs"
                wrapperStyle={{
                  width: fontUtils.w(160),
                  zIndex: 4,
                }}
              />
            </View>
            <View style={styles.filtersViewStyle}>
              <SelectInput
                items={jobTypes}
                value={worktype}
                onSelectItem={(e: any) => setWorkType(e?.value)}
                placeholder="Job type"
                wrapperStyle={{
                  marginBottom: fontUtils.h(10),
                  zIndex: 3,
                }}
              />
              <View style={[layoutConstants.styles.rowView]}>
                <SelectInput
                  items={statesData?.data || []}
                  value={state}
                  loading={loadingStates}
                  schema={{
                    id: "id",
                    value: "id",
                    label: "name",
                  }}
                  onSelectItem={(e: any) => setState(e.id)}
                  placeholder="State"
                  listMode="MODAL"
                  searchable
                  searchPlaceholder="State"
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  wrapperStyle={{
                    flex: 1,
                    marginRight: fontUtils.w(5),
                    zIndex: 2,
                  }}
                />
                <SelectInput
                  items={citiesData?.data || []}
                  value={city}
                  loading={fetchingCities}
                  schema={{
                    id: "id",
                    value: "name",
                    label: "name",
                  }}
                  onSelectItem={(e: any) => setCity(e.name)}
                  placeholder="City"
                  listMode="MODAL"
                  searchable
                  searchPlaceholder="City"
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  wrapperStyle={{
                    flex: 1,
                    marginRight: fontUtils.w(5),
                    zIndex: 2,
                  }}
                />
              </View>
              <SelectInput
                items={PRICE_RANGES.jobs_salary_range}
                value={range}
                onSelectItem={(e: any) => setRange(e.value)}
                placeholder="Salary range"
                wrapperStyle={{
                  zIndex: 2,
                  marginTop: fontUtils.h(10),
                }}
              />
            </View>
          </View>
          <Button
            title={"Search"}
            icon={
              <Feather
                name="search"
                size={fontUtils.h(18)}
                color={colorWhite}
              />
            }
            buttonHeight={fontUtils.h(40)}
            titleStyle={{
              fontFamily: fontUtils.manrope_regular,
              fontSize: fontUtils.h(12),
            }}
            wrapperStyle={{
              alignSelf: "center",
              width: fontUtils.w(130),
              marginBottom: fontUtils.h(20),
            }}
          />
        </View>
      )}
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
      >
        Featured Jobs
      </Text>
      {/* <Text mb={fontUtils.h(15)} size={fontUtils.h(10)}>
        Lagos, Nigeria
      </Text> */}
      {(featuredJobs?.data || []).map((item: JobObjectType, index: number) => (
        <JobListingHorizontalItem key={`featured-${index}`} {...item} />
      ))}
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
        mt={fontUtils.h(30)}
      >
        Top Jobs for You
      </Text>
      {(data?.data || []).map((item: JobObjectType, index: number) => (
        <JobListingHorizontalItem key={`job-${index}`} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  headerViewStyle: {
    marginTop: fontUtils.h(40),
    marginBottom: fontUtils.h(20),
  },
  filtersViewStyle: {
    marginTop: fontUtils.h(20),
  },
});
