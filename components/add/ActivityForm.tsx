import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Tag } from '@/services/database/types';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ActivityFormProps {
  title: string;
  onTitleChange: (text: string) => void;
  tags: Tag[];
  selectedTag: number | null;
  onTagSelect: (tagId: number) => void;
  disabled?: boolean;
}

export default function ActivityForm({
  title,
  onTitleChange,
  tags,
  selectedTag,
  onTagSelect,
  disabled = false
}: ActivityFormProps) {
  // 🎨 Couleurs dynamiques
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const placeholderColor = '#999'; // Gris moyen, passe bien sur les deux modes

  return (
    <View>
      <TextInput
        style={[
          styles.input, 
          { backgroundColor: cardColor, color: textColor }
        ]}
        placeholder="Titre de l'activité"
        placeholderTextColor={placeholderColor}
        value={title}
        onChangeText={onTitleChange}
        editable={!disabled}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsScroll}
      >
        {tags.map(tag => {
          const isSelected = selectedTag === tag.id;
          
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tag,
                { 
                  // Si sélectionné : Couleur Primaire (Violet)
                  // Sinon : La couleur du tag venant de la BDD
                  backgroundColor: isSelected ? primaryColor : tag.color 
                }
              ]}
              onPress={() => onTagSelect(tag.id)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.tagText, 
                  // Si sélectionné : Blanc
                  // Sinon : Couleur du texte standard (Noir/Blanc selon le mode) ou Primaire selon tes goûts
                  { color: isSelected ? 'white' : textColor } 
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    // backgroundColor géré dynamiquement
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    // color géré dynamiquement
    marginBottom: 20,
    
    // Ombres
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tagsScroll: { 
    flexDirection: 'row', 
    paddingVertical: 5, 
    marginBottom: 30 
  },
  tag: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 10,
    // Ajout d'une petite bordure invisible ou ombre si besoin pour détacher les tags clairs
  },
  tagText: { 
    fontSize: 14, 
    fontWeight: '600' // Un peu plus gras pour la lisibilité
  },
});