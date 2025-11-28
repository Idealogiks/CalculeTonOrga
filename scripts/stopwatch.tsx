import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StopwatchProps {
  isRunning?: boolean;
  onReset?: () => void;
}

export default function Stopwatch({ isRunning = false, onReset }: StopwatchProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setTime(0);
      onReset?.();
    }

    return () => clearInterval(interval);
  }, [isRunning, onReset]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontSize: 56,
    fontWeight: '300',
    color: '#7B68EE',
    letterSpacing: 2,
  },
});