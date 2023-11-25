import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Body from "./Body";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING } from "../assets/constants";

interface Props {
  selectedStartDate: (date: Date) => void;
  selectedEndDate: (date: Date) => void;
}

const DatePicker: React.FC<Props> = ({
  selectedStartDate,
  selectedEndDate,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartVisible, setStartVisibility] = useState(false);
  const [isEndVisible, setEndVisibility] = useState(false);

  const handleConfirmStart = (selectedDate: Date) => {
    setStartDate(selectedDate);
    selectedStartDate(selectedDate);
    setStartVisibility(false);
  };

  const handleConfirmEnd = (selectedDate: Date) => {
    setEndDate(selectedDate);
    selectedEndDate(selectedDate);
    setEndVisibility(false);
  };

  const formatDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "";
  };

  const formatTime = (date: Date | null) => {
    return date
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Pressable
          onPress={() => setStartVisibility(true)}
          style={styles.circle}
        >
          {!startDate && <Body>start date</Body>}
          {startDate && (
            <>
              <Body>{formatDate(startDate)}</Body>
              <Body>{formatTime(startDate)}</Body>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.pickerContainer}>
        <Pressable onPress={() => setEndVisibility(true)} style={styles.circle}>
          {!endDate && <Body>end date</Body>}
          {endDate && (
            <>
              <Body>{formatDate(endDate)}</Body>
              <Body>{formatTime(endDate)}</Body>
            </>
          )}
        </Pressable>
      </View>

      <DateTimePickerModal
        isVisible={isStartVisible}
        mode="datetime"
        onConfirm={handleConfirmStart}
        onCancel={() => setStartVisibility(false)}
        date={startDate || new Date()}
        minimumDate={new Date()}
        maximumDate={endDate}
      />

      <DateTimePickerModal
        isVisible={isEndVisible}
        mode="datetime"
        onConfirm={handleConfirmEnd}
        onCancel={() => setEndVisibility(false)}
        date={endDate || new Date()}
        minimumDate={startDate}
      />
    </View>
  );
};

export default DatePicker;

const diameter =
  (Dimensions.get("window").width - 2 * HORIZONTAL_PADDING) / 2 - 20;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.BACKGROUND,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingVertical: 20,
  },
  pickerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    height: diameter,
    width: diameter,
    borderWidth: 10,
    borderColor: theme.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});
