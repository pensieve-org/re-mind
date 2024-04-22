import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const GradientScrollView = ({
  children,
  gradientHeight = 20,
  gradientColors = ["rgba(0,0,0,1)", "rgba(0,0,0,0)"],
  ...scrollViewProps
}) => {
  return (
    <View style={[styles.container, scrollViewProps.style]}>
      <ScrollView
        {...scrollViewProps}
        contentContainerStyle={{ paddingBottom: gradientHeight }}
        style={[styles.scrollView, { paddingTop: gradientHeight }]}
      >
        {children}
      </ScrollView>
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1]]}
        style={[styles.gradient, { top: 0, height: gradientHeight }]}
      />
      <LinearGradient
        colors={[gradientColors[1], gradientColors[0]]}
        style={[styles.gradient, { bottom: 0, height: gradientHeight }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});

export default GradientScrollView;
