import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { ScrollView, Text } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ApartmentListingItem } from "src/components/apartments.components";
import { Input, SelectInput } from "src/components/inputs.components";
import { Feather } from "@expo/vector-icons";
import { PropertyObjectType, PropertyType } from "src/types/properties.types";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useDebounce } from "use-debounce";
import {
  useGetPropertiesQuery,
  useGetPropertyTypesAndCategoriesQuery,
} from "src/services/redux/apis/unauth.api.requests";
import { usePage } from "src/providers/page.provider";
import { PAGE_FILTERS, PRICE_RANGES } from "src/constants/app.constants";
import {
  useGetCitiesQuery,
  useGetStatesQuery,
} from "src/services/redux/apis/countries.api.requests";
import { colorPrimary } from "src/constants/colors.constants";

export default function ApartmentsTabScreen({
  navigation,
  route,
  withSearch = true,
}: RootStackScreenProps<"HomeTabNavigator" | "ExploreTabNavigator"> & {
  withSearch?: boolean;
}) {
  const { setPage } = usePage();
  const [searchText, setSearchText] = useState("");
  const [searchValue] = useDebounce(searchText, 3000);
  const [pageFilter, setPageFilter] = useState("apartments");
  const [typeFilter, setTypeFilter] = useState<PropertyType>("apartment");
  const [city, setCity] = useState("");
  const [state, setState] = useState("2901");
  const [range, setRange] = useState("");

  const { isLoading: loadingStates, data: statesData } = useGetStatesQuery({
    countryid: "158",
  });
  const { isFetching: fetchingCities, data: citiesData } = useGetCitiesQuery({
    stateid: state,
  });

  useEffect(() => {
    setPage(pageFilter);
  }, [pageFilter]);

  const {
    isFetching,
    data: propertiesData,
    refetch,
  } = useGetPropertiesQuery({
    //@ts-ignore
    type: typeFilter === "apartment" ? "apartment,land" : typeFilter,
    title: searchValue !== "" ? searchValue : undefined,
    status: "listed",
    city: city !== "" ? city : undefined,
    price: range !== "" ? range : undefined,
  });

  const {
    isFetching: fetchingLease,
    data: leaseData,
    refetch: refetchLease,
  } = useGetPropertiesQuery({
    type: typeFilter,
    category: "lease",
    title: searchValue !== "" ? searchValue : undefined,
    status: "listed",
    city: city !== "" ? city : undefined,
    price: range !== "" ? range : undefined,
  });

  const {
    isFetching: fetchingTrending,
    data: trendingData,
    refetch: refetchTrending,
  } = useGetPropertiesQuery({
    averagerating: "4,5",
    type: typeFilter,
    title: searchValue !== "" ? searchValue : undefined,
    status: "listed",
    city: city !== "" ? city : undefined,
    price: range !== "" ? range : undefined,
  });

  const { isFetching: fetchingTypes, data: typesData } =
    useGetPropertyTypesAndCategoriesQuery(null);

  const renderApartments = useCallback(
    ({ item, index }: { item: PropertyObjectType; index: number }) => (
      <ApartmentListingItem {...item} />
    ),
    [],
  );

  const onRefresh = () => {
    refetch();
    refetchTrending();
    refetchLease();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: layoutConstants.tabBarHeight,
      }}
      refreshControl={
        <AppRefreshControl refreshing={isFetching} onRefresh={onRefresh} />
      }
    >
      {withSearch ? (
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for apartments"
          leftIcon={
            <Feather
              name="search"
              style={{ marginLeft: fontUtils.w(15) }}
              size={fontUtils.h(20)}
              color={"rgba(0, 0, 0, 0.5)"}
            />
          }
          rightIcon={
            isFetching ? <ActivityIndicator color={colorPrimary} /> : undefined
          }
          inputHeight={fontUtils.h(40)}
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
                placeholder="Apartments"
                wrapperStyle={{
                  width: fontUtils.w(160),
                  zIndex: 4,
                }}
              />
            </View>
            <View style={styles.filtersViewStyle}>
              <SelectInput
                items={typesData?.data?.types || []}
                value={typeFilter}
                onSelectItem={(e: any) => setTypeFilter(e?.value)}
                loading={fetchingTypes}
                placeholder="Apartment type"
                wrapperStyle={{
                  marginBottom: fontUtils.h(10),
                  zIndex: 3,
                }}
              />
              <View style={[]}>
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
                    marginBottom: fontUtils.h(10),
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
                    zIndex: 2,
                  }}
                />
              </View>
              <SelectInput
                items={PRICE_RANGES.apartments_for_sale}
                value={range}
                onSelectItem={(e: any) => setRange(e.value)}
                placeholder="Price range"
                wrapperStyle={{
                  zIndex: 2,
                  marginTop: fontUtils.h(10),
                }}
              />
            </View>
          </View>
          {/* <Button
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
          /> */}
        </View>
      )}
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
      >
        {`Popular homes & Lands for sale${city !== "" ? ` in ${city}` : ""}`}
      </Text>
      <FlatList
        data={propertiesData?.data || []}
        renderItem={renderApartments}
        refreshControl={
          <AppRefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        horizontal
      />
      {leaseData?.data?.length > 0 ? (
        <Text
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
          mt={fontUtils.h(30)}
        >
          Apartments for Lease
        </Text>
      ) : null}
      <FlatList
        data={leaseData?.data || []}
        renderItem={renderApartments}
        refreshControl={
          <AppRefreshControl
            refreshing={fetchingLease}
            onRefresh={refetchLease}
          />
        }
        horizontal
      />
      {trendingData?.data?.length > 0 ? (
        <Text
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(15)}
          mt={fontUtils.h(30)}
        >
          Trending in your Area
        </Text>
      ) : null}
      <FlatList
        data={trendingData?.data || []}
        renderItem={renderApartments}
        refreshControl={
          <AppRefreshControl
            refreshing={fetchingTrending}
            onRefresh={refetchTrending}
          />
        }
        horizontal
      />
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
