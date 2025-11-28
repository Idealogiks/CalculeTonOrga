import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet,KeyboardAvoidingView,Platform,Alert} from "react-native";
import Stopwatch from "../../scripts/stopwatch";
import * as db from '@/services/database';
import { Tag } from '@/services/database/types';

export default function AddActivities() {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.initDatabase()
      .then(() => db.getAllTags())
      .then(setTags)
      .catch(() => Alert.alert("Erreur", "Impossible de charger les tags"))
      .finally(() => setLoading(false));
  }, []);

  const handleStartStop = async () => {
    if (!isRecording) {
      if (!selectedTag) {
        Alert.alert("Attention", "Veuillez sélectionner un tag");
        return;
      }
      setIsRecording(true);
      setStartTime(new Date());
    } else {
      if (!startTime || !selectedTag) return;
      
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      const tag = tags.find(t => t.id === selectedTag);
      const activityName = title || tag?.name || "Activité";

      try {
        await db.createActivity({
          title: activityName,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          isManual: false,
          tagId: selectedTag
        });

        Alert.alert(
          "Enregistré",
          `${activityName}\n${Math.floor(duration / 60)}m ${duration % 60}s`
        );

        setIsRecording(false);
        setStartTime(null);
        setTitle("");
        setSelectedTag(null);
      } catch (error) {
        console.error("Erreur sauvegarde:", error);
        Alert.alert("Erreur", "Impossible de sauvegarder");
      }
    }
  };

  const handleTagPress = (tagId: number) => {
    if (selectedTag === tagId) {
      setSelectedTag(null);
      setTitle("");
    } else {
      setSelectedTag(tagId);
      const tag = tags.find(t => t.id === tagId);
      if (tag) setTitle(tag.name);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder="Titre de l'activité"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          editable={!isRecording}
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
              onPress={() => handleTagPress(tag.id)}
              disabled={isRecording}
            >
              <Text style={[styles.tagText, selectedTag === tag.id && styles.tagSelected]}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.stopwatch}>
          <Stopwatch isRunning={isRecording} />
        </View>

        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonStop]}
          onPress={handleStartStop}
        >
          <Text style={[styles.buttonText, isRecording && styles.buttonTextStop]}>
            {isRecording ? "Arrêter" : "Démarrer"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 120 },
  input: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tagsScroll: { flexDirection: 'row', paddingVertical: 5, marginBottom: 30 },
  tag: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  tagText: { color: '#7B68EE', fontSize: 14, fontWeight: '500' },
  tagSelected: { color: 'white' },
  stopwatch: { alignItems: 'center', marginVertical: 40 },
  button: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonStop: { backgroundColor: '#FF6B6B' },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#666' },
  buttonTextStop: { color: 'white' },
});