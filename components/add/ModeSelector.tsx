import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ModeSelectorProps {
  isManual: boolean;
  onSwitch: (isManual: boolean) => void;
}

export default function ModeSelector({ isManual, onSwitch }: ModeSelectorProps) {
  const cardColor = useThemeColor({}, 'card'); 
  const activeColor = useThemeColor({}, 'secondary'); 
  const textColor = useThemeColor({}, 'primary'); 
  const textActiveColor = '#FFFFFF';

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={[
          styles.modeButton, 
          { backgroundColor: !isManual ? activeColor : cardColor }
        ]} 
        onPress={() => onSwitch(false)}
      >
        <Text style={[
          styles.modeButtonText, 
          { color: !isManual ? textActiveColor : textColor }
        ]}>
          Ajout automatique
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.modeButton, 
          { backgroundColor: isManual ? activeColor : cardColor }
        ]} 
        onPress={() => onSwitch(true)}
      >
        <Text style={[
          styles.modeButtonText, 
          { color: isManual ? textActiveColor : textColor }
        ]}>
          Ajout manuel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 0, 
    gap: 40,
  },
  modeButton: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    flex: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});