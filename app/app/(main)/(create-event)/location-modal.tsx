import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import theme from "../../../assets/theme";
import { HORIZONTAL_PADDING } from "../../../assets/constants";
import LocationSearchBar from "../../../components/LocationSearchBar";

export default function Modal() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSelectPlace = (data, details = null) => {
    // Assuming you want to set the location based on the selected place
    if (details && details.geometry) {
      setLocation({
        ...location,
        coords: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
      });

      // Optionally, set a marker for the selected location
      setMarkers([
        {
          id: data.place_id,
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng,
          description: data.description,
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <LocationSearchBar
        placeholder="Enter a location"
        onPress={() => {}}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API,
          language: "en",
        }}
        fetchDetails={true}
      />

      {/* <MapView
        style={styles.map}
        region={{
          latitude: location?.coords?.latitude || 0,
          longitude: location?.coords?.longitude || 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
          />
        ))}
      </MapView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: theme.TEXT,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  searchBarContainer: {
    width: "100%",
    paddingVertical: 10,
    zIndex: 1, // Ensure the search bar is above the map
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});
