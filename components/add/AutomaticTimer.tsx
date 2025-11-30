import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Stopwatch from '../../scripts/stopwatch';
import { useThemeColor } from '@/hooks/use-theme-color';

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
  const cardColor = useThemeColor({}, 'card');      
  const primaryColor = useThemeColor({}, 'primary');
  
  const stopColor = '#FF6B6B'; 

  return (
    <>
      <View style={styles.stopwatch}>
        <Stopwatch isRunning={isRecording} initialTime={elapsedTime} />
      </View>

      <TouchableOpacity
        style={[
          styles.button, 
          { backgroundColor: cardColor }, 
          isRecording && { backgroundColor: stopColor }
        ]}
        onPress={onStartStop}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText, 
          { color: primaryColor }, 
          isRecording && styles.buttonTextStop 
        ]}>
          {isRecording ? "Pause" : elapsedTime > 0 ? "Reprendre" : "Démarrer"}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  stopwatch: { 
    alignItems: 'center', 
    marginVertical: 40 
  },
  button: {
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: '600', 
  },
  buttonTextStop: { 
    color: 'white' 
  },
});