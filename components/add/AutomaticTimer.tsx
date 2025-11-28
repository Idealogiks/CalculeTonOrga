import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Stopwatch from '../../scripts/stopwatch';

interface AutomaticTimerProps {
  isRecording: boolean;
  elapsedTime: number;
  onStartStop: () => void;
}

export default function AutomaticTimer({
  isRecording,
  elapsedTime,
  onStartStop
}: AutomaticTimerProps) {
  return (
    <>
      <View style={styles.stopwatch}>
        <Stopwatch isRunning={isRecording} initialTime={elapsedTime} />
      </View>

      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonStop]}
        onPress={onStartStop}
      >
        <Text style={[styles.buttonText, isRecording && styles.buttonTextStop]}>
          {isRecording ? "Pause" : elapsedTime > 0 ? "Reprendre" : "Démarrer"}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  stopwatch: { alignItems: 'center', marginVertical: 40 },
  button: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 3,
  },
  buttonStop: { backgroundColor: '#FF6B6B' },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#666' },
  buttonTextStop: { color: 'white' },
});