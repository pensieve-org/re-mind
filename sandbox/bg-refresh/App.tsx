import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log(`Got background fetch call at date: ${new Date().toISOString()}`);

  const startJson = await AsyncStorage.getItem("start");
  const start = startJson ? JSON.parse(startJson) : Date.now();

  await updatePhotos(start, () => {});
  await checkImageUploadQueue();

  // return BackgroundFetch.BackgroundFetchResult.Failed;

  // return BackgroundFetch.BackgroundFetchResult.NewData;

  // return BackgroundFetch.BackgroundFetchResult.NoData;
});

const checkImageUploadQueue = async () => {
  console.log("Checking image upload queue...");
  const uploadPhotos = async () => {
    // Get photoUris
    const photoUrisJson = await AsyncStorage.getItem("photoUris");
    const photoUris = photoUrisJson ? JSON.parse(photoUrisJson) : [];

    // Get uploadedUris
    const uploadedUrisJson = await AsyncStorage.getItem("uploadedUris");
    const uploadedUris = uploadedUrisJson ? JSON.parse(uploadedUrisJson) : [];

    // Find the URIs of the photos that haven't been uploaded yet
    const urisToUpload = photoUris.filter(
      (uri: string) => !uploadedUris.includes(uri)
    );

    // Upload the photos and add the URIs to the uploadedUris array
    for (const uri of urisToUpload) {
      // Instead of uploading each image, just console log
      console.log(`Image uploaded: ${uri}`);
      uploadedUris.push(uri);
    }

    // Save the uploadedUris to AsyncStorage
    await AsyncStorage.setItem("uploadedUris", JSON.stringify(uploadedUris));
  };

  // Call the function
  await uploadPhotos();
};

const updatePhotos = async (
  start: number,
  setStorageChange: React.Dispatch<React.SetStateAction<number>>
) => {
  const { assets } = await MediaLibrary.getAssetsAsync({
    mediaType: "photo",
    sortBy: ["creationTime"],
  });

  const newAssets = assets.filter((asset) => asset.creationTime > start);

  if (newAssets.length > 0) {
    const newUris = newAssets.reverse().map((asset) => asset.uri);

    // Get the existing URIs from AsyncStorage
    const existingUrisJson = await AsyncStorage.getItem("photoUris");
    const existingUris = existingUrisJson ? JSON.parse(existingUrisJson) : [];

    // Combine the existing URIs and new URIs, and remove duplicates
    const combinedUris = Array.from(new Set([...existingUris, ...newUris]));

    // Save the combined URIs to AsyncStorage
    await AsyncStorage.setItem("photoUris", JSON.stringify(combinedUris));
    console.log("Saved new photos to AsyncStorage");
    setStorageChange((prevState) => prevState + 1); // Use setStorageChange here
  }
};

export default function App() {
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [subscription, setSubscription] =
    useState<MediaLibrary.Subscription | null>(null);
  const [start, setStart] = useState<number>(Date.now());
  const [storageChange, setStorageChange] = useState(0); // Move this inside the component

  useEffect(() => {
    const getPhotoUris = async () => {
      const photoUrisJson = await AsyncStorage.getItem("photoUris");
      const photoUris = photoUrisJson ? JSON.parse(photoUrisJson) : [];
      setPhotoUris(photoUris);
    };

    getPhotoUris();
  }, [storageChange]);

  useEffect(() => {
    let newSubscription: MediaLibrary.Subscription | null = null;
    let intervalId: NodeJS.Timeout;

    if (isListening) {
      newSubscription = MediaLibrary.addListener(() =>
        updatePhotos(start, setStorageChange)
      );
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
      AsyncStorage.setItem("start", JSON.stringify(Date.now()));
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
