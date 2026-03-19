import React, { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import { colorPrimary } from "src/constants/colors.constants";
import fontUtils from "src/utils/font.utils";
import AllTabScreen from "./tabs/all.tab";
import ApartmentsTabScreen from "./tabs/apartments.tab";
import ServicesTabScreen from "./tabs/services.tab";
import { usePage } from "src/providers/page.provider";
import HotelsTabScreen from "./tabs/hotels.tab";
import JobsTabScreen from "./tabs/job.tab";

const routes = [
  { key: "all", title: "All" },
  { key: "apartments", title: "Apartments" },
  { key: "services", title: "Services" },
  { key: "hotels", title: "Hotels" },
  { key: "jobs", title: "Jobs" },
];

export default function HomeTabScreen({
  navigation,
  route,
}: RootStackScreenProps<"HomeTabNavigator">) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { setPage } = usePage();

  useEffect(() => {
    setPage(routes[index].key);
  }, [index]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            scrollEnabled={true}
            indicatorStyle={{
              backgroundColor: colorPrimary,
              height: fontUtils.h(2),
            }}
            activeColor={colorPrimary}
            inactiveColor={"rgba(0, 0, 0, 0.5)"}
            style={{
              backgroundColor: "transparent",
              height: fontUtils.h(40),
              marginTop: fontUtils.h(15),
              // marginBottom: fontUtils.h(20),
            }}
            tabStyle={{
              width: 100,
            }}
            contentContainerStyle={{
              paddingHorizontal: fontUtils.w(10),
            }}
            {...props}
          />
        )}
        renderScene={({ route: tabRoute }) => {
          switch (tabRoute.key) {
            case "all":
              return <AllTabScreen navigation={navigation} route={route} />;
            case "apartments":
              return (
                <ApartmentsTabScreen navigation={navigation} route={route} />
              );
            case "services":
              return (
                <ServicesTabScreen navigation={navigation} route={route} />
              );
            case "hotels":
              return <HotelsTabScreen navigation={navigation} route={route} />;

            default:
              return <JobsTabScreen navigation={navigation} route={route} />;
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});
