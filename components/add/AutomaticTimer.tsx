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
  // 🎨 Couleurs dynamiques
  const cardColor = useThemeColor({}, 'card');       // Fond du bouton (Blanc/Gris foncé)
  const primaryColor = useThemeColor({}, 'primary'); // Texte du bouton (Violet)
  
  // Le rouge reste rouge, peu importe le thème (c'est une couleur d'alerte)
  const stopColor = '#FF6B6B'; 

  return (
    <>
      <View style={styles.stopwatch}>
        {/* Note : Assure-toi que ton composant Stopwatch gère aussi ses propres couleurs si besoin */}
        <Stopwatch isRunning={isRecording} initialTime={elapsedTime} />
      </View>

      <TouchableOpacity
        style={[
          styles.button, 
          { backgroundColor: cardColor }, // Couleur de fond dynamique
          isRecording && { backgroundColor: stopColor } // Override rouge si en enregistrement
        ]}
        onPress={onStartStop}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText, 
          { color: primaryColor }, // Couleur de texte dynamique
          isRecording && styles.buttonTextStop // Override blanc si en enregistrement
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
    // backgroundColor retiré ici
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    
    // Ombres (Android + iOS)
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  // buttonStop style retiré car géré inline pour écraser le style dynamique
  buttonText: { 
    fontSize: 18, 
    fontWeight: '600', 
    // color retiré ici
  },
  buttonTextStop: { 
    color: 'white' 
  },
});