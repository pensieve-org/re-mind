import React, { useState, useEffect } from "react";
import Body from "./Body";
import {
  initializeRegistryWithDefinitions,
  View as AnimatedView,
} from "react-native-animatable";
import { View } from "react-native";
import theme from "../assets/theme";
const blinkAnimation = {
  0: { opacity: 1 },
  0.8: { opacity: 1 },
  0.81: { opacity: 0 },
  1.2: { opacity: 0 },
  1.21: { opacity: 1 },
  2: { opacity: 1 },
};

initializeRegistryWithDefinitions({
  blinkAnimation,
});

function CountdownTimer({ endTime }) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, "0");

        if (days > 0) {
          setCountdown(`${days}:${hours}:${minutes}:${seconds}`);
        } else if (hours !== "00") {
          setCountdown(`${hours}:${minutes}:${seconds}`);
        } else {
          setCountdown(`${minutes}:${seconds}`);
        }
      } else {
        setCountdown("event has ended");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        height: 70,
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Body size={36}>{countdown}</Body>
        {countdown !== "Event has ended" && countdown !== "" && (
          <AnimatedView
            animation="blinkAnimation"
            iterationCount="infinite"
            duration={2000}
            style={{
              width: 10,
              height: 10,
              borderRadius: 100,
              backgroundColor: theme.RED,
              top: 0,
              right: -15,
              position: "absolute",
            }}
          />
        )}
      </View>
    </View>
  );
}

export default CountdownTimer;
