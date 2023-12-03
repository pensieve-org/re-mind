import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { View as AnimatedView } from "react-native-animatable";
import { router, useLocalSearchParams } from "expo-router";

import BackArrow from "../../assets/arrow-left.svg";
import ThreeDots from "../../assets/three-dots.svg";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  EVENT_IMAGE_WIDTH,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  IMAGE_GAP,
  ROW_IMAGES,
} from "../../assets/constants";
import theme from "../../assets/theme";
import Body from "../../components/Body";
import Header from "../../components/Header";
import getEventDetails from "../../services/getEventDetails";
import { AppContext } from "../_layout";
import Subtitle from "../../components/Subtitle";
import ShowAttendees from "../../components/ShowAttendees";
import CountdownTimer from "../../components/CountdownTimer";
import Swiper from "react-native-swiper";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import getEventAdmins from "../../services/getEventAdmins";
import getEventAttendees from "../../services/getEventAttendees";
import getEventImages from "../../services/getEventImages";
import EventInvitation from "../../components/EventInvitation";
import respondEventInvitation from "../../services/respondEventInvitation";

export default function Event() {
  const local = useLocalSearchParams();

  const {
    userDetails,
    selectedEvent,
    setSelectedEvent,
    userEvents,
    setUserEvents,
  } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [images, setImages] = useState([]);
  const [isInvited, setIsInvited] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const admins = await getEventAdmins(selectedEvent.eventId);
      const adminStatus = admins.some(
        (admin) => admin.userId === userDetails.userId
      );
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
  }, [selectedEvent, userDetails]);

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  const navigate = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.push(route);
    }, ANIMATION_DURATION);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setSelectedEvent(await getEventDetails(selectedEvent.eventId));
    setRefreshing(false);
  }, []);

  const formatDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "";
  };

  const formatTime = (date: Date | null) => {
    return date
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";
  };
  const onSwipeUp = ({ nativeEvent }) => {
    if (!modalVisible) return;
    if (nativeEvent.translationY < -50 && nativeEvent.state === State.ACTIVE) {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    const fetchEventAttendees = async () => {
      const eventAttendees = await getEventAttendees(
        selectedEvent.eventId,
        userDetails.userId
      );
      setAttendees(eventAttendees);
    };

    const fetchEventImages = async () => {
      const eventImages = await getEventImages(selectedEvent.eventId);
      setImages(eventImages);
    };

    fetchEventImages();

    fetchEventAttendees();

    setIsInvited(selectedEvent.isInvited);
  }, []);

  const handleEventInvitation = async (response) => {
    await respondEventInvitation(
      response,
      selectedEvent.eventId,
      userDetails.userId
    );

    if (response) {
      setUserEvents({
        live: userEvents.live.map((event) =>
          event.eventId === selectedEvent.eventId
            ? { ...event, isInvited: false }
            : event
        ),
        past: userEvents.past.map((event) =>
          event.eventId === selectedEvent.eventId
            ? { ...event, isInvited: false }
            : event
        ),
        future: userEvents.future.map((event) =>
          event.eventId === selectedEvent.eventId
            ? { ...event, isInvited: false }
            : event
        ),
      });

      //change isInvited to false in userEvents
      setSelectedEvent({
        ...selectedEvent,
        isInvited: false,
      });
      setIsInvited(false);
    } else {
      setUserEvents({
        live: userEvents.live.filter(
          (event) => event.eventId !== selectedEvent.eventId
        ),
        past: userEvents.past.filter(
          (event) => event.eventId !== selectedEvent.eventId
        ),
        future: userEvents.future.filter(
          (event) => event.eventId !== selectedEvent.eventId
        ),
      });

      navigateBack();
    }
  };

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
            style={{ color: theme.PRIMARY }}
          />
        }
        onPressLeft={navigateBack}
        imageRight={
          isAdmin && (
            <ThreeDots
              height={HEADER_ICON_DIMENSION}
              width={HEADER_ICON_DIMENSION}
              style={{ color: theme.PRIMARY }}
            />
          )
        }
        onPressRight={() => {
          if (isAdmin) {
            navigate("/edit-event");
          }
        }}
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        {refreshing && (
          <ActivityIndicator
            style={{ padding: 10 }}
            size={"large"}
            color={theme.PRIMARY}
          />
        )}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <Subtitle
              size={23}
              style={{
                color: theme.PRIMARY,
                paddingVertical: 10,
              }}
            >
              {selectedEvent.eventName}
            </Subtitle>

            {isInvited && <EventInvitation onPress={handleEventInvitation} />}

            {/* TODO: Replace this with a timeline with length = event duration and split into 
            mins if event < 1hr, hours if event < 1 day, otherwise days
            have a line graph for umber of photos uploaded in each segment */}
            {local.event === "past" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingVertical: 10,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Body size={18}>
                    {formatDate(selectedEvent.startTime.toDate())}
                  </Body>
                  <Body size={18}>
                    {formatTime(selectedEvent.startTime.toDate())}
                  </Body>
                </View>

                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <BackArrow
                    height={20}
                    width={20}
                    style={{
                      color: theme.PRIMARY,
                      transform: [{ rotate: "180deg" }],
                    }}
                  />
                </View>

                <View style={{ alignItems: "center" }}>
                  <Body size={18}>
                    {formatDate(new Date(selectedEvent.endTime.toDate()))}
                  </Body>
                  <Body size={18}>
                    {formatTime(new Date(selectedEvent.endTime.toDate()))}
                  </Body>
                </View>
              </View>
            ) : (
              local.event === "live" && (
                <CountdownTimer endTime={selectedEvent.endTime} />
              )
            )}

            <Subtitle
              size={20}
              style={{
                color: theme.PRIMARY,
                paddingVertical: 10,
              }}
            >
              shared with
            </Subtitle>
            <ShowAttendees attendees={attendees} />
          </View>

          <View style={styles.imageContainer}>
            {images.length > 0 ? (
              images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setModalVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: image.imageUrl }}
                    style={[
                      styles.image,
                      {
                        marginRight:
                          (index + 1) % ROW_IMAGES === 0 ? 0 : IMAGE_GAP,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ paddingVertical: 20, justifyContent: "center" }}>
                <Body>No images yet</Body>
              </View>
            )}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <PanGestureHandler onGestureEvent={onSwipeUp}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                }}
              >
                <Swiper
                  showsButtons={true}
                  index={selectedImageIndex}
                  dotColor={theme.PLACEHOLDER}
                  activeDotColor={theme.PRIMARY}
                  nextButton={
                    <BackArrow
                      height={20}
                      width={20}
                      style={{
                        color: theme.PRIMARY,
                        transform: [{ rotate: "180deg" }],
                      }}
                    />
                  }
                  prevButton={
                    <BackArrow
                      height={20}
                      width={20}
                      style={{
                        color: theme.PRIMARY,
                      }}
                    />
                  }
                >
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  ))}
                </Swiper>
              </View>
            </PanGestureHandler>
          </Modal>
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
    justifyContent: "center",
  },
  image: {
    width: EVENT_IMAGE_WIDTH,
    height: EVENT_IMAGE_WIDTH,
    marginBottom: IMAGE_GAP,
  },
});
