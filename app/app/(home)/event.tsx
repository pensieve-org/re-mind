import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
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
  EVENT_IMAGE_WIDTH,
  IMAGE_GAP,
  ROW_IMAGES,
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
} from "../../assets/constants";
import { AppContext } from "../_layout";
import BackArrow from "../../assets/arrow-left.svg";
import { ScrollView } from "react-native-gesture-handler";
import getEvent from "../../services/get.event";
import { View as AnimatedView } from "react-native-animatable";

export default function Event() {
  const { userDetails, selectedEvent, setSelectedEvent } =
    useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setSelectedEvent(await getEvent(selectedEvent.event_id));
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
          />
        }
        onPressLeft={navigateBack}
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
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

          <Body style={{ paddingVertical: 20 }}>
            Event id: {selectedEvent.event_id}
          </Body>
          <View style={styles.imageContainer}>
            {selectedEvent.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.url }}
                style={[
                  styles.image,
                  {
                    marginRight: (index + 1) % ROW_IMAGES === 0 ? 0 : IMAGE_GAP,
                  },
                ]}
              />
            ))}
          </View>
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
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  image: {
    width: EVENT_IMAGE_WIDTH,
    height: EVENT_IMAGE_WIDTH,
    marginBottom: IMAGE_GAP,
  },
});
