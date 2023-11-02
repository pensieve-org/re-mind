import React from "react";
import { StyleSheet, View, Image, TextInput } from "react-native";

interface Props {
  imageSource: string;
}

const EventCircle: React.FC<Props> = ({ imageSource }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageSource }} style={styles.image} />
      </View>
      <TextInput style={styles.textInput} placeholder="Enter text here" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    textAlign: "center",
  },
});

export default EventCircle;
