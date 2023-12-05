import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as MediaLibrary from "expo-media-library";
export default function App() {
  const [photoUris, setPhotoUris] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("user needs to grant permission to photos.");
        return;
      }

      const subscription = MediaLibrary.addListener(async () => {
        const { assets: newAssets } = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          first: 3,
        });

        setPhotoUris((prevUris) => {
          // Filter out any duplicates
          const newUris = newAssets.map((asset) => asset.uri);
          const uniqueNewUris = newUris.filter(
            (newUri) => !prevUris.includes(newUri)
          );
          return [...prevUris, ...uniqueNewUris];
        });
      });

      return () => {
        subscription.remove();
      };
    })();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Photos</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {photoUris.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    alignItems: "center", // Center items horizontally in the container
    justifyContent: "flex-start", // Align items to the top of the container
    backgroundColor: "#fff", // White background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20, // Vertical margin
  },
  image: {
    width: 50, // Fixed width
    height: 50, // Fixed height
    margin: 5, // Margin around each image
  },
});
