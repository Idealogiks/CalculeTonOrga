import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FloatingActionButtonsProps {
  onCancel: () => void;
  onValidate: () => void;
}

export default function FloatingActionButtons({
  onCancel,
  onValidate
}: FloatingActionButtonsProps) {
  return (
    <>
      <TouchableOpacity
        style={[styles.floatingButton, styles.floatingCancel]}
        onPress={onCancel}
      >
        <Text style={styles.floatingIcon}>✕</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.floatingButton, styles.floatingValidate]}
        onPress={onValidate}
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
    backgroundColor: '#6464B3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  floatingCancel: { left: 30 },
  floatingValidate: { right: 30 },
  floatingIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
});