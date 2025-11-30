import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ManualTimeInputProps {
  startTime: Date;
  endTime: Date;
  onStartTimeChange: (date: Date) => void;
  onEndTimeChange: (date: Date) => void;
}

export default function ManualTimeInput({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange
}: ManualTimeInputProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const cardColor = useThemeColor({}, 'card');         
  const primaryColor = useThemeColor({}, 'primary');   
  const secondaryColor = useThemeColor({}, 'secondary');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.timePickerRow}>
        <Text style={[styles.timeLabel, { color: primaryColor }]}>Début</Text>
        <TouchableOpacity 
          style={[styles.timeButton, { backgroundColor: secondaryColor }]}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={[styles.timeText, { color: primaryColor }]}>
            {formatTime(startTime)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timePickerRow}>
        <Text style={[styles.timeLabel, { color: primaryColor }]}>Fin</Text>
        <TouchableOpacity 
          style={[styles.timeButton, { backgroundColor: secondaryColor }]}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={[styles.timeText, { color: primaryColor }]}>
            {formatTime(endTime)}
          </Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) onStartTimeChange(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) onEndTimeChange(selectedDate);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '300',
  },
});