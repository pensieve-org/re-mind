import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Header from "../../components/Header";
import Body from "../../components/Body";
import theme from "../../assets/theme";
import {
  HORIZONTAL_PADDING,
  HEADER_ICON_DIMENSION,
} from "../../assets/constants";
import Subtitle from "../../components/Subtitle";
import { AppContext } from "../_layout";
import Plus from "../assets/plus.svg";
import EventList from "../../components/EventList";
import { ScrollView } from "react-native-gesture-handler";
import getAllUserEvents from "../../services/get.allUserEvents";

export default function Home() {
  const { userDetails, userEvents, setUserEvents, setSelectedEvent } =
    useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setUserEvents(await getAllUserEvents(userDetails.user_id));
    setRefreshing(false);
  }, []);

  const handleEventPress = async (event) => {
    setSelectedEvent(event);
    router.push("/event");
  };

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <View
            style={{
              width: HEADER_ICON_DIMENSION,
              height: HEADER_ICON_DIMENSION,
              borderRadius: 100,
              backgroundColor: userDetails.profile_picture_url
                ? "transparent"
                : "blue",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userDetails.profile_picture_url ? (
              <Image
                source={{ uri: userDetails.profile_picture_url }}
                style={{
                  width: HEADER_ICON_DIMENSION,
                  height: HEADER_ICON_DIMENSION,
                  borderRadius: 100,
                }}
              />
            ) : (
              <Body style={{ textAlign: "center" }}>
                {userDetails.first_name[0]}
              </Body>
            )}
          </View>
        }
        onPressLeft={() => router.push("/profile")}
        imageRight={
          <Plus height={HEADER_ICON_DIMENSION} width={HEADER_ICON_DIMENSION} />
        }
        onPressRight={() => router.push("/create-event")}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {refreshing && (
          <ActivityIndicator
            style={{ padding: 10 }}
            size={"large"}
            color={theme.PRIMARY}
          />
        )}

        <View style={{ paddingVertical: 20 }}>
          <Subtitle size={23}>memories</Subtitle>
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Subtitle size={20}>ongoing</Subtitle>
        </View>

        {userEvents.ongoing.length > 0 ? (
          <EventList events={userEvents.ongoing} onPress={handleEventPress} />
        ) : (
          <Body style={{ textAlign: "center", paddingVertical: 10 }}>
            no ongoing events
          </Body>
        )}

        <View style={{ paddingVertical: 20 }}>
          <Subtitle size={20}>past</Subtitle>
        </View>

        {userEvents.past.length > 0 ? (
          <EventList events={userEvents.past} onPress={handleEventPress} />
        ) : (
          <Body style={{ textAlign: "center", paddingVertical: 10 }}>
            no past events
          </Body>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 50,
  },
});
