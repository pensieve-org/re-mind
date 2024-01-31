import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { router, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import debounce from "lodash.debounce";

export default function Modal() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [search, setSearch] = useState("");

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

  const searchLocations = useCallback(
    debounce(async (searchText) => {
      if (searchText.length < 3) return;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.EXPO_PUBLIC_GOOGLE_API}&input=${searchText}`
      );
      const data = await response.json();
      setMarkers(
        data.predictions.map((prediction) => ({
          id: prediction.place_id,
          description: prediction.description,
          lat: null,
          lng: null,
        }))
      );
    }, 500),
    []
  );

  const selectLocation = async (placeId) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.EXPO_PUBLIC_GOOGLE_API}&placeid=${placeId}`
    );
    const data = await response.json();
    const selectedLocation = data.result.geometry.location;
    setLocation({
      ...location,
      coords: {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      },
    });

    setMarkers(
      markers.map((marker) =>
        marker.id === placeId
          ? { ...marker, lat: selectedLocation.lat, lng: selectedLocation.lng }
          : marker
      )
    );
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    searchLocations(text);
  };

  return (
    <View style={styles.container}>
      {!router.canGoBack() && <Link href="../">Dismiss</Link>}
      <StatusBar style="light" />
      <TextInput
        placeholder="Search"
        value={search}
        onChangeText={handleSearchChange}
        style={styles.searchBar}
      />
      <MapView
        style={styles.map}
        region={{
          latitude: location?.coords?.latitude || 0,
          longitude: location?.coords?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers
          .filter((marker) => marker.lat && marker.lng)
          .map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            />
          ))}
      </MapView>
      <FlatList
        data={markers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectLocation(item.id)}>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    width: "90%",
    marginTop: 20,
  },
  map: {
    width: "90%",
    height: 400,
    borderRadius: 10,
    marginTop: 20,
  },
});
