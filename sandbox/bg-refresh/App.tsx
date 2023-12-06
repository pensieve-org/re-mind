import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log(`Got background fetch call at date: ${new Date().toISOString()}`);
  await checkImageUploadQueue();

  // return BackgroundFetch.BackgroundFetchResult.Failed;

  // return BackgroundFetch.BackgroundFetchResult.NewData;

  // return BackgroundFetch.BackgroundFetchResult.NoData;
});

const checkImageUploadQueue = async () => {
  console.log("Checking image upload queue...");
};

export default function App() {
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [subscription, setSubscription] =
    useState<MediaLibrary.Subscription | null>(null);
  const [start, setStart] = useState<number>(Date.now());

  const updatePhotos = async () => {
    // TODO: move this outside the function, save images to async storage and then pull out
    // so that the bg task can also us this function
    // then change this function to read from async storage
    const { assets } = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      sortBy: ["creationTime"],
    });

    // Filter new assets and update the lastAsset
    const newAssets = assets.filter((asset) => asset.creationTime > start);

    if (newAssets.length > 0) {
      setPhotoUris(() => [...newAssets.reverse().map((asset) => asset.uri)]);
    }
  };

  useEffect(() => {
    let newSubscription: MediaLibrary.Subscription | null = null;
    let intervalId: NodeJS.Timeout;

    if (isListening) {
      newSubscription = MediaLibrary.addListener(updatePhotos);
      setSubscription(newSubscription);
      intervalId = setInterval(checkImageUploadQueue, 5000);
    }

    return () => {
      newSubscription?.remove();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isListening]);

  const toggleListener = () => {
    if (isListening) {
      subscription?.remove();
      setSubscription(null);
      try {
        BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
        console.log("Background fetch unregistered");
      } catch (err) {
        console.log("Background fetch failed to unregister");
      }
    } else {
      setStart(Date.now());
      try {
        BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log("Background fetch registered");
      } catch (err) {
        console.log("Background fetch failed to register");
      }
    }

    setIsListening(!isListening);
  };

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("User needs to grant permission to photos.");
        return;
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
    width: 80, // Fixed width
    height: 80, // Fixed height
    margin: 5, // Margin around each image
  },
});
