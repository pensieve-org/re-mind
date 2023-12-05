import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [subscription, setSubscription] =
    useState<MediaLibrary.Subscription | null>(null);
  const [lastAsset, setLastAsset] = useState<MediaLibrary.Asset | null>(null);

  const toggleListener = () => {
    if (isListening) {
      subscription?.remove();
      setSubscription(null);
    } else {
      const newSubscription = MediaLibrary.addListener(async () => {
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          sortBy: ["creationTime"],
        });

        const newAssets = assets.reverse();

        const newUris = newAssets
          .filter(
            (asset) => !lastAsset || asset.creationTime > lastAsset.creationTime
          )
          .map((asset) => asset.uri);

        setPhotoUris((prevUris) => [...prevUris, ...newUris]);
        if (newAssets.length > 0) {
          setLastAsset(newAssets[-1]);
        }
      });

      setSubscription(newSubscription);
    }

    setIsListening(!isListening);
  };

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("user needs to grant permission to photos.");
        return;
      }

      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
      });

      if (assets.length > 0) {
        setLastAsset(assets[0]);
      }
    })();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Photos</Text>
      <Button
        title={isListening ? "Stop Listening" : "Start Listening"}
        onPress={toggleListener}
      />
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
