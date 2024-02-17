import React, { useContext, useEffect, useState } from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { router, Stack } from "expo-router";
import BackArrow from "../../../assets/arrow-left.svg";
import ThreeDots from "../../../assets/three-dots.svg";
import {
  EVENT_IMAGE_WIDTH,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  IMAGE_GAP,
  ROW_IMAGES,
  HEADER_MARGIN,
} from "../../../assets/constants";
import theme from "../../../assets/theme";
import Body from "../../../components/Body";
import { AppContext } from "../../_layout";
import Subtitle from "../../../components/Subtitle";
import ShowAttendees from "../../../components/ShowAttendees";
import CountdownTimer from "../../../components/CountdownTimer";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import getEventAttendees from "../../../apis/getEventAttendees";
import getEventImages from "../../../apis/getEventImages";
import EventInvitation from "../../../components/EventInvitation";
import respondEventInvitation from "../../../apis/respondEventInvitation";
import { collection, doc, onSnapshot, where, query } from "firebase/firestore";
import { db } from "../../../firebase.js";
import GradientScrollView from "../../../components/GradientScrollView";

export default function Event() {
  const { userDetails, selectedEvent, setSelectedEvent, setUserEvents } =
    useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [attendees, setAttendees] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const eventRef = doc(collection(db, "events"), selectedEvent.eventId);

    const imagesUnsubscribe = onSnapshot(
      collection(eventRef, "images"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("New image: ", change.doc.data());
            setImages((prevImages) => [...prevImages, change.doc.data()]);
          }
          if (change.type === "modified") {
            console.log("Modified image: ", change.doc.data());
            setImages((prevImages) =>
              prevImages.map((image) =>
                image.id === change.doc.id ? change.doc.data() : image
              )
            );
          }
          if (change.type === "removed") {
            console.log("Removed image: ", change.doc.data());
            setImages((prevImages) =>
              prevImages.filter((image) => image.id !== change.doc.id)
            );
          }
        });
      }
    );

    // Listener for changes in events
    const eventUnsubscribe = onSnapshot(eventRef, (d) => {
      if (d.exists()) {
        const newDetails = d.data() as EventDetails;
        const updatedEvent = {
          ...newDetails,
          isInvited: selectedEvent.isInvited,
        };
        // Update the userEvents state
        setSelectedEvent(updatedEvent);
      }
    });

    // Listener for changes in event attendees
    const attendeesRef = collection(db, "attendees");
    const q = query(
      attendeesRef,
      where("eventId", "==", selectedEvent.eventId),
      where("userId", "==", userDetails.userId)
    );
    const attendeesUnsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          setSelectedEvent((prevEvent) => ({
            ...prevEvent,
            isInvited: change.doc.data().userType === "invited",
          }));
        }
      });
    });

    // Cleanup function to unsubscribe from the listeners when the component is unmounted
    return () => {
      imagesUnsubscribe();
      eventUnsubscribe();
      attendeesUnsubscribe();
    };
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

  // move this into cache from previous screen
  const fetchEventImages = async () => {
    const eventImages = await getEventImages(selectedEvent.eventId);
    setImages(eventImages);
  };

  useEffect(() => {
    const fetchEventAttendees = async () => {
      const eventAttendees = await getEventAttendees(
        selectedEvent.eventId,
        userDetails.userId
      );
      setAttendees(eventAttendees);
    };

    fetchEventImages();

    fetchEventAttendees();
  }, []);

  const handleEventInvitation = async (response) => {
    await respondEventInvitation(
      response,
      selectedEvent.eventId,
      userDetails.userId
    );

    // TODO: remove this? handle with listeners instead
    if (response) {
      // if accept, change isInvited to false in both selected and user events
      setSelectedEvent({
        ...selectedEvent,
        isInvited: false,
      });

      setUserEvents((prevUserEvents) =>
        prevUserEvents.map((event) =>
          event.eventId === selectedEvent.eventId
            ? { ...event, isInvited: false }
            : event
        )
      );
    } else {
      // otherwise, delete the event from the list of user events
      setUserEvents((prevUserEvents) =>
        prevUserEvents.filter(
          (event) => event.eventId !== selectedEvent.eventId
        )
      );

      router.back();
    }
  };

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/event-settings")}
              style={{ marginRight: HEADER_MARGIN }}
            >
              <ThreeDots
                height={HEADER_ICON_DIMENSION}
                width={HEADER_ICON_DIMENSION}
                style={{ color: theme.PRIMARY }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <GradientScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
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

          {selectedEvent.isInvited && (
            <EventInvitation onPress={handleEventInvitation} />
          )}

          {/* TODO: Replace this with a timeline with length = event duration and split into 
            mins if event < 1hr, hours if event < 1 day, otherwise days
            have a line graph for umber of photos uploaded in each segment */}
          {selectedEvent.status !== "live" ? (
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

              <View style={{ alignItems: "center", justifyContent: "center" }}>
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
            selectedEvent.status === "live" && (
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
              <Carousel
                loop
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 50,
                  parallaxAdjacentItemScale: 0.8,
                }}
                defaultIndex={selectedImageIndex}
                width={Dimensions.get("window").width}
                height={Dimensions.get("window").height}
                autoPlay={false}
                data={images}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log("current index:", index)}
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                renderItem={({ item }) => (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />
            </View>
          </PanGestureHandler>
        </Modal>
      </GradientScrollView>
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
