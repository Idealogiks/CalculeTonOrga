// scripts/stopwatch.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Stopwatch() {
  const [time, setTime] = useState(0); // tick units = 1 per 10ms
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((t) => t + 1); // functional update to avoid stale closure
      }, 10); // 10 ms -> time increments of 1
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  // time units: 1 = 10ms
  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  const startAndStop = () => {
    setIsRunning((r) => !r);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const fmt = (n: number) => n.toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {hours}:{fmt(minutes)}:{fmt(seconds)}:{fmt(milliseconds)}
      </Text>

      <View style={styles.buttons}>
        <Pressable
          onPress={startAndStop}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isRunning && styles.buttonStop,
          ]}
        >
          <Text style={styles.buttonText}>{isRunning ? "Stop" : "Start"}</Text>
        </Pressable>

        <Pressable
          onPress={reset}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#b91c1c",
  },
  time: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 12,
  },
  buttons: {
    flexDirection: "row",
    gap: 12, 
  },
  button: {
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#6184b6ff", // neutral dark
    alignItems: "center",
  },
  buttonStop: {
    backgroundColor: "#b91c1c",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
