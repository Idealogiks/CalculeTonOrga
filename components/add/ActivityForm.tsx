import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Tag } from '@/services/database/types';
import { useThemeColor } from '@/hooks/use-theme-color';

const darkenColor = (hex: string, amount: number) => {
  let color = hex.replace('#', '');
  if (color.length === 3) color = color.split('').map(c => c + c).join('');

  const num = parseInt(color, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;

  return '#' + (
    0x1000000 +
    (r < 0 ? 0 : r) * 0x10000 +
    (g < 0 ? 0 : g) * 0x100 +
    (b < 0 ? 0 : b)
  ).toString(16).slice(1);
};

interface ActivityFormProps {
  title: string;
  onTitleChange: (text: string) => void;
  tags: Tag[];
  selectedTag: number | null;
  onTagSelect: (tagId: number) => void;
  disabled?: boolean;
  onAddCategoryPress: () => void;
}

export default function ActivityForm({
  title,
  onTitleChange,
  tags,
  selectedTag,
  onTagSelect,
  disabled = false,
  onAddCategoryPress
}: ActivityFormProps) {
  
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = '#999';

  return (
    <View>
      <TextInput
        style={[styles.input, { backgroundColor: cardColor, color: textColor }]}
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
          
          const backgroundColor = isSelected ? darkenColor(tag.color, 40) : tag.color;

          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tag,
                { 
                  backgroundColor: backgroundColor,
                  transform: [{ scale: isSelected ? 1.05 : 1 }] 
                }
              ]}
              onPress={() => onTagSelect(tag.id)}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <Text 
                style={[
                  styles.tagText, 
                  { 
                    color: isSelected ? 'white' : '#333' 
                  } 
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.addTagButton, { borderColor: textColor }]}
          onPress={onAddCategoryPress}
          disabled={disabled}
        >
          <Text style={{ fontSize: 20, color: textColor, marginTop: -2 }}>+</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tagsScroll: { 
    flexDirection: 'row', 
    paddingVertical: 10, 
    marginBottom: 30,
    alignItems: 'center' 
  },
  tag: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 10,
  },
  tagText: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: 'transparent'
  }
});