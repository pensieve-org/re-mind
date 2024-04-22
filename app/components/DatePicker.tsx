import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Body from "./Body";
import theme from "../assets/theme";
import BackArrow from "../assets/arrow-left.svg";

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

  const getMinEndDate = () => {
    if (startDate) {
      let minEndDate = new Date(startDate);
      minEndDate.setMinutes(minEndDate.getMinutes() + 1);
      return minEndDate;
    }
    return new Date();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pickerContainer}
        onPress={() => setStartVisibility(true)}
      >
        {!startDate && (
          <Body bold={true} size={18} style={{ color: theme.PLACEHOLDER }}>
            start
          </Body>
        )}
        {startDate && (
          <>
            <Body size={18}>{formatDate(startDate)}</Body>
            <Body size={18}>{formatTime(startDate)}</Body>
          </>
        )}
      </Pressable>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 20,
          width: 20,
          paddingTop: 10,
        }}
      >
        {startDate && endDate && (
          <BackArrow
            height={20}
            width={20}
            style={{
              color: theme.PRIMARY,
              transform: [{ rotate: "180deg" }],
            }}
          />
        )}
      </View>

      <Pressable
        style={styles.pickerContainer}
        onPress={() => setEndVisibility(true)}
      >
        {!endDate && (
          <Body bold={true} size={18} style={{ color: theme.PLACEHOLDER }}>
            end
          </Body>
        )}
        {endDate && (
          <>
            <Body size={18}>{formatDate(endDate)}</Body>
            <Body size={18}>{formatTime(endDate)}</Body>
          </>
        )}
      </Pressable>

      <DateTimePickerModal
        isVisible={isStartVisible}
        mode="datetime"
        onConfirm={handleConfirmStart}
        onCancel={() => setStartVisibility(false)}
        date={startDate || new Date()}
        minimumDate={new Date()}
        maximumDate={endDate || undefined}
        is24Hour={true}
      />

      <DateTimePickerModal
        isVisible={isEndVisible}
        mode="datetime"
        onConfirm={handleConfirmEnd}
        onCancel={() => setEndVisibility(false)}
        date={endDate || getMinEndDate()}
        minimumDate={getMinEndDate()}
        is24Hour={true}
      />
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  pickerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 100,
  },
});
