import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import debounce from "lodash.debounce";
import LocationSearchBar from "../../../components/LocationSearchBar"; // Adjust the path as necessary
import theme from "../../../assets/theme";
import { HORIZONTAL_PADDING } from "../../../assets/constants";

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

      // Check if user's location is available
      const userLocation = location?.coords;
      const locationParam = userLocation
        ? `&location=${userLocation.latitude},${userLocation.longitude}&radius=50000`
        : "";

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.EXPO_PUBLIC_GOOGLE_API}&input=${searchText}${locationParam}`
      );
      const data = await response.json();
      setMarkers(
        data.predictions.map((prediction) => ({
          id: prediction.place_id,
          name: prediction.structured_formatting.main_text, // Assuming this as the name
          description: prediction.description, // Full address
          image: null, // Placeholder for image URL, to be fetched or assigned later
          lat: null,
          lng: null,
        }))
      );
    }, 500),
    [location] // Add location to the dependency array to ensure the callback is updated with the current location
  );

  const selectLocation = async (placeId) => {
    const detailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.EXPO_PUBLIC_GOOGLE_API}&placeid=${placeId}`
    );
    const detailsData = await detailsResponse.json();
    const selectedLocation = detailsData.result.geometry.location;
    const photoReference = detailsData.result.photos?.[0]?.photo_reference;
    const imageUrl = photoReference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_API}`
      : null;

    setLocation({
      ...location,
      coords: {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      },
    });

    // Assuming you want to update the markers here to include the selected location only
    setMarkers([
      {
        id: placeId,
        name: detailsData.result.name,
        description: detailsData.result.formatted_address,
        image: imageUrl,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
    ]);
  };

  const confirmLocation = async (placeId) => {
    // TODO: when a location is selected, send info back to other screen like this: https://stackoverflow.com/questions/76819796/how-to-pass-data-from-a-modal-with-expo-router-using-react-native
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    searchLocations(text);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <View style={{ paddingTop: 30, paddingBottom: 10, width: "100%" }}>
        <LocationSearchBar
          label="location"
          placeholder="enter a postcode or address"
          value={search}
          onChangeText={handleSearchChange}
        />
      </View>
      <MapView
        style={styles.map}
        region={{
          latitude: location?.coords?.latitude || 0,
          longitude: location?.coords?.longitude || 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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
          <TouchableOpacity
            onPress={() => selectLocation(item.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              />
            )}
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>{item.description}</Text>
            </View>
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
    backgroundColor: theme.TEXT,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});
