import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StopwatchProps {
  isRunning?: boolean;
  initialTime?: number;
  onReset?: () => void;
}

export default function Stopwatch({ isRunning = false, initialTime = 0, onReset }: StopwatchProps) {
  const [time, setTime] = useState(initialTime);
  const textColor = useThemeColor({}, 'primary'); 

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } 

    return () => clearInterval(interval);
  }, [isRunning]);

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
      <Text style={[styles.time, { color: textColor }]}>{formatTime(time)}</Text>
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
    letterSpacing: 2,
  },
});