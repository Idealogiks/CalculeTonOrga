import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Tag } from '@/services/database/types';

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
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Titre de l'activité"
        placeholderTextColor="#999"
        value={title}
        onChangeText={onTitleChange}
        editable={!disabled}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsScroll}
      >
        {tags.map(tag => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.tag,
              { backgroundColor: selectedTag === tag.id ? '#7B68EE' : tag.color }
            ]}
            onPress={() => onTagSelect(tag.id)}
            disabled={disabled}
          >
            <Text style={[styles.tagText, selectedTag === tag.id && styles.tagSelected]}>
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    elevation: 3,
  },
  tagsScroll: { flexDirection: 'row', paddingVertical: 5, marginBottom: 30 },
  tag: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  tagText: { color: '#7B68EE', fontSize: 14, fontWeight: '500' },
  tagSelected: { color: 'white' },
});