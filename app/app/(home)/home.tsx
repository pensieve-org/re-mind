import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { View as AnimatedView } from "react-native-animatable";

import Body from "../../components/Body";
import EventList from "../../components/EventList";
import Header from "../../components/Header";
import Subtitle from "../../components/Subtitle";

import Plus from "../../assets/plus.svg";
import theme from "../../assets/theme";

import {
  ANIMATION_DURATION,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
} from "../../assets/constants";

import { AppContext } from "../_layout";
import getAllUserEvents from "../../services/get.allUserEvents";

export default function Home() {
  const { userDetails, userEvents, setUserEvents, setSelectedEvent } =
    useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState("fadeIn");

  const navigate = (route) => {
    setAnimation("fadeOut");
    setTimeout(() => {
      router.push(route);
    }, ANIMATION_DURATION);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setUserEvents(await getAllUserEvents(userDetails.user_id));
    setRefreshing(false);
  }, []);

  const handleEventPress = async (event) => {
    setSelectedEvent(event);
    navigate("/event");
  };

  return (
    <View style={styles.page}>
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
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
          onPressLeft={() => navigate("/profile")}
          imageRight={
            <Plus
              height={HEADER_ICON_DIMENSION}
              width={HEADER_ICON_DIMENSION}
            />
          }
          onPressRight={() => navigate("/create-event")}
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
      </AnimatedView>
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
