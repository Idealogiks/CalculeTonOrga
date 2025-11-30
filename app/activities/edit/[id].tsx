import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useNavigation } from 'expo-router';
import * as db from '@/services/database'; 
import { Tag } from '@/services/database/types';
import ActivityForm from '@/components/add/ActivityForm';
import FloatingActionButtons from '@/components/add/FloatingActionButtons';
import AddCategoryModal from '@/components/add/AddCategoryModal';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function EditActivity() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [activityData, tagsData] = await Promise.all([
        db.getActivityById(Number(id)), 
        db.getAllTags()
      ]);

      if (!activityData) {
        Alert.alert("Erreur", "Cette activité n'existe plus.");
        router.back();
        return;
      }

      setTitle(activityData.title);
      setSelectedTag(activityData.tagId);
      setTags(tagsData);
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de charger l'activité");
    } finally {
      setLoading(false);
    }
  };

  const refreshTags = async () => {
    try {
      const newTags = await db.getAllTags();
      setTags(newTags);
    } catch (error) {
      console.error("Erreur refresh tags", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTag) {
      Alert.alert("Erreur", "Veuillez choisir une catégorie");
      return;
    }

    try {
      await db.updateActivity(Number(id), title, selectedTag);
      router.back(); 
    } catch (e) {
      Alert.alert("Erreur", "La modification a échoué");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer",
      "Veux-tu vraiment supprimer cette activité ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: async () => {
            await db.deleteActivity(Number(id));
            router.navigate('/(tabs)/home'); 
          }
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen 
        options={{
          headerTitle: "Modifier",
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={{ padding: 5 }}>
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          )
        }} 
      />

      <ActivityForm
        title={title}
        onTitleChange={setTitle}
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onAddCategoryPress={() => setModalVisible(true)}
      />

      <FloatingActionButtons
        onCancel={() => router.back()}
        onValidate={handleUpdate}
      />

      <AddCategoryModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          refreshTags();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 20 }
});