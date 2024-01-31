import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import MapView from "react-native-maps";

export default function LocationSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [inputText, setInputText] = useState("");
  const [predictions, setPredictions] = useState([]);

  const fetchPlaces = async (searchText) => {
    alert(searchText);
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
    setModalVisible(false);
  };

  return (
    <View style={styles.page}>
      <Button title="Select Location" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Search"
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              fetchPlaces(text);
            }}
            style={styles.searchBar}
          />
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          )}
          <ScrollView style={styles.resultsContainer}>
            {predictions.map((prediction, index) => (
              <Text
                key={index}
                onPress={() => selectLocation(prediction.place_id)}
                style={styles.resultText}
              >
                {prediction.description}
              </Text>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    marginTop: 200,
    alignItems: "center",
    backgroundColor: "white",
  },
  searchBar: {
    width: "100%",
    padding: 10,
  },
  resultsContainer: {
    flex: 1,
  },
  resultText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
});
