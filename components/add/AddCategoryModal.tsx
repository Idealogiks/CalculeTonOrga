import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as db from '@/services/database/tags';

const COLOR_PALETTE = ['#6464B3','#E09F95','#95B8A6','#8FB8DE','#E3C08D','#B08CA1','#7D8CA3','#94D0CC','#B8B8D1','#A3A3A3'];

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCategoryModal({ visible, onClose, onSuccess }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await db.createTag(name, selectedColor);
      setName(''); 
      onSuccess();
      onClose();   
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer la catégorie");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: cardColor }]}>
          <Text style={[styles.modalTitle, { color: textColor }]}>Nouvelle Catégorie</Text>

          <TextInput
            style={[styles.input, { color: textColor, borderColor: primaryColor }]}
            placeholder="Nom (ex: cuisine, code...)"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoFocus={true}
          />

          <Text style={[styles.label, { color: textColor }]}>Choisir une couleur :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorsScroll}>
            {COLOR_PALETTE.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </ScrollView>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={{ color: '#999' }}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.buttonCreate, { backgroundColor: primaryColor }]} onPress={handleCreate}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Créer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalView: {
    width: '85%',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 10, fontWeight: '600' },
  colorsScroll: { flexDirection: 'row', marginBottom: 25, maxHeight: 50 },
  colorCircle: { width: 35, height: 35, borderRadius: 17.5, marginRight: 12, borderWidth: 2, borderColor: 'transparent' },
  selectedColor: { borderColor: '#333', transform: [{ scale: 1.1 }] },
  buttonsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  buttonCancel: { padding: 10 },
  buttonCreate: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
});