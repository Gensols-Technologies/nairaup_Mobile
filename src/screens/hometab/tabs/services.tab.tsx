import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableText,
} from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import { Input, SelectInput } from "src/components/inputs.components";
import { Feather } from "@expo/vector-icons";
import { ServiceProvidersItem } from "src/components/providers.components";
import { useGetProvidersQuery } from "src/services/redux/apis";
import { usePage } from "src/providers/page.provider";
import { useDebounce } from "use-debounce";
import {
  useGetCitiesQuery,
  useGetStatesQuery,
} from "src/services/redux/apis/countries.api.requests";
import { useGetProfessionsQuery } from "src/services/redux/apis/unauth.api.requests";
import { colorPrimary } from "src/constants/colors.constants";
import { useAppSelector } from "src/hooks/useReduxHooks";
import ListEmpty from "src/components/list.empty";

export default function ServicesTabScreen({
  navigation,
  route,
  withSearch = true,
}: RootStackScreenProps<"HomeTabNavigator" | "ExploreTabNavigator"> & {
  withSearch?: boolean;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const { setPage } = usePage();
  const [searchText, setSearchText] = useState("");
  const [searchValue] = useDebounce(searchText, 1000);
  const [city, setCity] = useState("");
  const [state, setState] = useState("2901");
  const [range, setRange] = useState("");
  const [profession, setProfession] = useState("");

  const { isLoading: loadingStates, data: statesData } = useGetStatesQuery({
    countryid: "158",
  });
  const { isFetching: fetchingCities, data: citiesData } = useGetCitiesQuery({
    stateid: state,
  });

  const { isFetching, data } = useGetProfessionsQuery({
    order: "profession,asc",
  });

  const professions = useMemo(() => {
    const _data = data?.data || [];
    // _data.push({
    //   profession: "All",
    // });
    // _data.push({
    //   profession: "All",
    // });
    return _data;
  }, [data]);

  const {
    isFetching: fetchingProviders,
    data: providersData,
    refetch: refetchProviders,
  } = useGetProvidersQuery({
    profession:
      searchValue.length > 0
        ? searchValue
        : profession.length > 0 && profession !== "All"
        ? profession
        : undefined,
    city: city.length > 0 ? city : undefined,
  });

  if (!token)
    return (
      <SafeAreaView style={{ justifyContent: "center" }}>
        <ListEmpty note="You have to login to view service providers" />
        <TouchableText
          onPress={() => navigation.navigate("LoginScreen")}
          mt={fontUtils.h(20)}
          align="center"
        >
          Click to continue
        </TouchableText>
      </SafeAreaView>
    );

  return (
    <ScrollView style={styles.container}>
      {withSearch ? (
        <Input
          placeholder="Search for services"
          value={searchText}
          onChangeText={setSearchText}
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
            </View>
            <View style={styles.filtersViewStyle}>
              <SelectInput
                items={[{ profession: "All" }, ...professions]}
                loading={isFetching}
                schema={{
                  label: "profession",
                  value: "profession",
                  id: "profession",
                }}
                itemKey="profession"
                placeholder="Profession"
                label={"Profession"}
                value={profession}
                onSelectItem={(e: any) => setProfession(e.profession)}
                wrapperStyle={styles.selectWrapperStyle}
                listMode="MODAL"
                searchable
              />
              {/* <SelectInput
                        items={typesData?.data?.types || []}
                        value={typeFilter}
                        onSelectItem={(e: any) => setTypeFilter(e?.value)}
                        loading={fetchingTypes}
                        placeholder="Apartment type"
                        wrapperStyle={{
                          marginBottom: fontUtils.h(10),
                          zIndex: 3,
                        }}
                      /> */}
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
            </View>
          </View>
        </View>
      )}
      {/* <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
      >
        Cleaners around you
      </Text>
      <FlatList
        data={providersData?.data || []}
        renderItem={renderProviders}
        showsVerticalScrollIndicator={false}
        horizontal
      />
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
        mt={fontUtils.h(30)}
      >
        Cleaners around you
      </Text>
      <FlatList
        data={providersData?.data || []}
        renderItem={renderProviders}
        showsVerticalScrollIndicator={false}
        horizontal
      /> */}
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(15)}
        mt={fontUtils.h(30)}
      >
        {profession.length > 0 && profession !== "All"
          ? `${profession} around you`
          : "Professionals around you"}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {(providersData?.data || []).map((item: any, index: number) => (
          <ServiceProvidersItem
            key={`provider-${index}`}
            profile={item}
            wrapperStyle={styles.listItemStyle}
          />
        ))}
      </View>
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
  selectWrapperStyle: {
    marginBottom: fontUtils.h(15),
  },
  listItemStyle: {
    marginBottom: fontUtils.h(20),
    width:
      (deivceWidth -
        layoutConstants.mainViewHorizontalPadding * 2 -
        fontUtils.w(20)) /
      2,
  },
});
