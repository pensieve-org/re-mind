import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import Input from "./Input";
import LocationDot from "../assets/location-dot.svg";
import theme from "../assets/theme";

export default function LocationSelector() {
  const [location, setLocation] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [inputText, setInputText] = useState("");

  const fetchPlaces = async (searchText) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.GOOGLE_API}&input=${searchText}`
    );
    const data = await response.json();
    setPredictions(data.predictions);
  };

  const selectLocation = async (placeId) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_API}&placeid=${placeId}`
    );
    const data = await response.json();
    setLocation(data.result.geometry.location);
  };

  return (
    <View style={styles.page}>
      <View style={styles.inputRow}>
        <LocationDot height={20} width={20} style={{ color: theme.PRIMARY }} />
        <Input
          placeholder="Search"
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            fetchPlaces(text);
          }}
        />
      </View>
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <Text onPress={() => selectLocation(item.place_id)}>
            {item.description}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
