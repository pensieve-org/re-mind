import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { router, Link, Stack } from "expo-router";
import theme from "../../../assets/theme";
import { HORIZONTAL_PADDING } from "../../../assets/constants";
import Body from "../../../components/Body";
import { AppContext } from "../../_layout";
import Subtitle from "../../../components/Subtitle";
import SubtitleInput from "../../../components/SubtitleInput";
import DatePicker from "../../../components/DatePicker";
import AddFriendsList from "../../../components/AddFriendsList";
import LocationSearchBar from "../../../components/LocationSearchBar";
import createEvent from "../../../apis/createEvent";
import getUserEvents from "../../../apis/getUserEvents";
import Alert from "../../../components/Alert";
import Header from "../../../components/Header";
import { useHeaderProps } from "../../../hooks/useHeaderProps";
import getFriendDetails from "../../../apis/getFriendDetails";
import CalendarPlus from "../../../assets/calendar-plus-regular.svg";
import { GeoPoint } from "firebase/firestore";

export default function CreateEvent() {
  const { userDetails, setUserEvents } = useContext(AppContext);
  const [eventName, setEventName] = useState(null);
  const [geoPoint, setGeoPoint] = useState(null);
  const [address, setAddress] = useState(null);
  const [description, setDescription] = useState(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unselectedFriends, setUnselectedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const headerProps = useHeaderProps();

  const handleCreateEvent = async () => {
    if (isLoading) return;

    setError(false);

    if (!startDate || !endDate || !eventName) {
      setError(true);
      setErrorMsg("Please fill out all required fields");
      return;
    }

    setIsLoading(true);
    const now = new Date();

    let status, uploadFlag;
    uploadFlag = false;
    if (now < startDate) {
      status = "future";
    } else if (now > endDate) {
      status = "past";
    } else {
      status = "live";
      uploadFlag = true;
    }

    try {
      // TODO: Add description and location
      await createEvent(
        {
          startTime: startDate,
          endTime: endDate,
          eventName: eventName,
          status: status,
          thumbnail: null,
          uploadFlag: uploadFlag,
          description: description,
          geoPoint: geoPoint,
          address: address,
        },
        selectedFriends,
        userDetails
      );

      // TODO: remove this eventually, when the auto listener works
      setUserEvents(await getUserEvents(userDetails.userId));

      router.back();
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setIsLoading(false);
      setErrorMsg(error.message || "An error occurred");
      alert(
        `start time: ${startDate}, end time: ${endDate}, event name: ${eventName}, status: ${status}, upload flag: ${uploadFlag}, description: ${description}, geo point: ${geoPoint}, address: ${address}`
      );
    }
  };

  const fetchFriends = async () => {
    try {
      setUnselectedFriends(await getFriendDetails(userDetails.userId));
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              {...headerProps}
              onPressRight={() => handleCreateEvent()}
              imageRight={
                <CalendarPlus
                  height={"100%"}
                  width={"100%"}
                  style={{
                    color:
                      !startDate || !endDate || !eventName
                        ? theme.PLACEHOLDER
                        : theme.TEXT,
                  }}
                />
              }
            />
          ),
        }}
      />
      {error && (
        <View style={styles.alertContainer}>
          <Alert text={errorMsg} />
        </View>
      )}

      <View style={styles.container}>
        <View
          style={{
            paddingTop: 10,
          }}
        >
          {/* TODO: maybe add in thumbnail in a row with event name, same as it shows on the event screen */}
          <SubtitleInput
            size={25}
            text={"event name..."}
            onChangeText={setEventName}
          />

          <View
            style={{
              paddingTop: 5,
            }}
          >
            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={setDescription}
              value={description}
              placeholderTextColor={theme.PLACEHOLDER}
              placeholder="description..."
              style={{
                color: theme.TEXT,
                fontSize: 14,
                fontFamily: "MontserratRegular",
                letterSpacing: -0.408,
              }}
            />
          </View>
        </View>

        <View
          style={{
            paddingVertical: 20,
          }}
        >
          {/* TODO: Make this a modal with a full calendar and time picker */}
          <DatePicker
            selectedStartDate={setStartDate}
            selectedEndDate={setEndDate}
          />
        </View>

        <View
          style={{
            paddingTop: 20,
            zIndex: 1000,
          }}
        >
          <LocationSearchBar
            placeholder="location..."
            onPress={(data, details) => {
              const { lat, lng } = details.geometry.location;
              setGeoPoint(new GeoPoint(lat, lng));
              setAddress(details.formatted_address);
            }}
          />
        </View>

        {/* TODO: Make this a modal where friends are selected from a list (like whatsapp) and displayed in a carousel */}
        <View
          style={{
            paddingTop: 20,
            height: 170,
          }}
        >
          <Subtitle
            size={20}
            style={{
              paddingBottom: 10,
              color:
                selectedFriends.length > 0 ? theme.TEXT : theme.PLACEHOLDER,
            }}
          >
            attendees
          </Subtitle>
          {selectedFriends.length > 0 ? (
            <AddFriendsList
              unselectedFriends={selectedFriends}
              selectedFriends={unselectedFriends}
              setSelectedFriends={setUnselectedFriends}
              setUnselectedFriends={setSelectedFriends}
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <Body style={{ color: theme.PLACEHOLDER }}>
                no friends invited
              </Body>
            </View>
          )}
        </View>

        <View
          style={{
            paddingTop: 20,
            height: 170,
          }}
        >
          <Subtitle
            size={20}
            style={{
              paddingBottom: 10,
              color:
                unselectedFriends.length > 0 ? theme.TEXT : theme.PLACEHOLDER,
            }}
          >
            invite friends
          </Subtitle>
          {unselectedFriends.length > 0 ? (
            <AddFriendsList
              unselectedFriends={unselectedFriends}
              selectedFriends={selectedFriends}
              setSelectedFriends={setSelectedFriends}
              setUnselectedFriends={setUnselectedFriends}
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <Body style={{ color: theme.PLACEHOLDER }}>
                no friends to add
              </Body>
            </View>
          )}
        </View>
      </View>
      <Modal animationType="fade" transparent={true} visible={isLoading}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <ActivityIndicator size={"large"} color={theme.PRIMARY} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
  container: {
    marginHorizontal: HORIZONTAL_PADDING,
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingBottom: 50,
  },
});
