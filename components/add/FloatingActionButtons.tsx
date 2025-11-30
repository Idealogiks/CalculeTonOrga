import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FloatingActionButtonsProps {
  onCancel: () => void;
  onValidate: () => void;
}

export default function FloatingActionButtons({
  onCancel,
  onValidate
}: FloatingActionButtonsProps) {
  const primaryColor = useThemeColor({}, 'primary');
  return (
    <>
      <TouchableOpacity
        style={[
          styles.floatingButton, 
          styles.floatingCancel,
          { backgroundColor: primaryColor } 
        ]}
        onPress={onCancel}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingIcon}>✕</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.floatingButton, 
          styles.floatingValidate,
          { backgroundColor: primaryColor }
        ]}
        onPress={onValidate}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingIcon}>✓</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  floatingCancel: { 
    left: 30 
  },
  floatingValidate: { 
    right: 30 
  },
  floatingIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white', 
  },
});