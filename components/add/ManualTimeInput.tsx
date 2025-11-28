import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timePickerRow}>
        <Text style={styles.timeLabel}>Début</Text>
        <TouchableOpacity 
          style={styles.timeButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.timeText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timePickerRow}>
        <Text style={styles.timeLabel}>Fin</Text>
        <TouchableOpacity 
          style={styles.timeButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.timeText}>{formatTime(endTime)}</Text>
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    elevation: 3,
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
    color: '#7B68EE',
  },
  timeButton: {
    backgroundColor: '#E8E5FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#7B68EE',
  },
});