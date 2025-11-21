import React from "react";
import { View } from "react-native";
import Stopwatch from "../../scripts/stopwatch"; // adapte le chemin si nécessaire

export default function AddActivities() {
  return (
    <View style={{ flex: 1 }}>
      <Stopwatch />
    </View>
  );
}

