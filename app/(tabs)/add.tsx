import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Stopwatch from "../../scripts/stopwatch";
import * as db from '@/services/database';
import { Tag } from '@/services/database/types';

export default function AddActivities() {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.initDatabase()
      .then(() => db.getAllTags())
      .then(setTags)
      .catch(() => Alert.alert("Erreur", "Impossible de charger les tags"))
      .finally(() => setLoading(false));
  }, []);

  const handleStartStop = () => {
    if (!isRecording) {
      if (!selectedTag) {
        Alert.alert("Attention", "Veuillez sélectionner un tag");
        return;
      }
      setIsRecording(true);
      setStartTime(new Date());
    } else {
      if (startTime) {
        const now = new Date();
        const sessionDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(prev => prev + sessionDuration);
      }
      setIsRecording(false);
      setStartTime(null);
    }
  };

  const handleValidate = async () => {
    if (!selectedTag) {
      Alert.alert("Attention", "Veuillez sélectionner un tag");
      return;
    }

    let totalDuration = elapsedTime;
    if (isRecording && startTime) {
      const now = new Date();
      totalDuration += Math.floor((now.getTime() - startTime.getTime()) / 1000);
    }

    if (totalDuration === 0) {
      Alert.alert("Attention", "L'activité doit avoir une durée");
      return;
    }

    const tag = tags.find(t => t.id === selectedTag);
    const activityName = title || tag?.name || "Activité";
    
    const endTime = new Date();
    const calculatedStartTime = new Date(endTime.getTime() - (totalDuration * 1000));

    try {
      await db.createActivity({
        title: activityName,
        startTime: calculatedStartTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: totalDuration,
        isManual: false,
        tagId: selectedTag
      });

      Alert.alert(
        "✅ Enregistré",
        `${activityName}\n${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`
      );

      setIsRecording(false);
      setStartTime(null);
      setElapsedTime(0);
      setTitle("");
      setSelectedTag(null);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler l'activité",
      "Voulez-vous vraiment annuler cette activité ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui",
          style: "destructive",
          onPress: () => {
            setIsRecording(false);
            setStartTime(null);
            setElapsedTime(0);
            setTitle("");
            setSelectedTag(null);
          }
        }
      ]
    );
  };

  const handleTagPress = (tagId: number) => {
    if (isRecording || elapsedTime > 0) return;
    
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

  const hasActivity = elapsedTime > 0 || isRecording;

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
          editable={!hasActivity}
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
              disabled={hasActivity}
            >
              <Text style={[styles.tagText, selectedTag === tag.id && styles.tagSelected]}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.stopwatch}>
          <Stopwatch 
            isRunning={isRecording}
            initialTime={elapsedTime}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonStop]}
          onPress={handleStartStop}
        >
          <Text style={[styles.buttonText, isRecording && styles.buttonTextStop]}>
            {isRecording ? "Pause" : elapsedTime > 0 ? "Reprendre" : "Démarrer"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {hasActivity && (
        <>
          <TouchableOpacity
            style={[styles.floatingButton, styles.floatingCancel]}
            onPress={handleCancel}
          >
            <Text style={styles.floatingIcon}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.floatingButton, styles.floatingValidate]}
            onPress={handleValidate}
          >
            <Text style={styles.floatingIcon}>✓</Text>
          </TouchableOpacity>
        </>
      )}
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
    elevation: 3,
  },
  buttonStop: { backgroundColor: '#FF6B6B' },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#666' },
  buttonTextStop: { color: 'white' },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a7a0cfff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  
  floatingCancel: {
    left: 30,
  },
  
  floatingValidate: {
    right: 30,
  },
  
  floatingIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
});