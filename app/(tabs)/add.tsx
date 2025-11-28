import React, { useState, useEffect } from "react";
import {View,Text,TouchableOpacity,ScrollView,StyleSheet,KeyboardAvoidingView,Platform,Alert} from "react-native";
import * as db from '@/services/database';
import { Tag } from '@/services/database/types';
import ActivityForm from '@/components/add/ActivityForm';
import AutomaticTimer from '@/components/add/AutomaticTimer';
import ManualTimeInput from '@/components/add/ManualTimeInput';
import FloatingActionButtons from '@/components/add/FloatingActionButtons';

export default function AddActivities() {
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualStartTime, setManualStartTime] = useState(new Date());
  const [manualEndTime, setManualEndTime] = useState(new Date());

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

    let totalDuration: number;
    let activityStartTime: Date;
    let activityEndTime: Date;

    if (isManualMode) {
      if (manualEndTime < manualStartTime) {
        Alert.alert("Attention", "L'heure de fin doit être après l'heure de début");
        return;
      }
      totalDuration = Math.floor((manualEndTime.getTime() - manualStartTime.getTime()) / 1000);
      activityStartTime = manualStartTime;
      activityEndTime = manualEndTime;
    } else {
      totalDuration = elapsedTime;
      if (isRecording && startTime) {
        const now = new Date();
        totalDuration += Math.floor((now.getTime() - startTime.getTime()) / 1000);
      }

      if (totalDuration === 0) {
        Alert.alert("Attention", "L'activité doit avoir une durée");
        return;
      }

      activityEndTime = new Date();
      activityStartTime = new Date(activityEndTime.getTime() - (totalDuration * 1000));
    }

    const tag = tags.find(t => t.id === selectedTag);
    const activityName = title || tag?.name || "Activité";

    try {
      await db.createActivity({
        title: activityName,
        startTime: activityStartTime.toISOString(),
        endTime: activityEndTime.toISOString(),
        duration: totalDuration,
        isManual: isManualMode,
        tagId: selectedTag
      });

      Alert.alert(
        "✅ Enregistré",
        `${activityName}\n${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`
      );

      resetForm();
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
        { text: "Oui", style: "destructive", onPress: resetForm }
      ]
    );
  };

  const resetForm = () => {
    setIsRecording(false);
    setStartTime(null);
    setElapsedTime(0);
    setTitle("");
    setSelectedTag(null);
    setManualStartTime(new Date());
    setManualEndTime(new Date());
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

  const toggleMode = () => {
    if (isRecording || elapsedTime > 0) {
      Alert.alert("Attention", "Terminez ou annulez l'activité en cours");
      return;
    }
    setIsManualMode(!isManualMode);
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
        <ActivityForm
          title={title}
          onTitleChange={setTitle}
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={handleTagPress}
          disabled={isRecording || elapsedTime > 0}
        />

        {isManualMode ? (
          <ManualTimeInput
            startTime={manualStartTime}
            endTime={manualEndTime}
            onStartTimeChange={setManualStartTime}
            onEndTimeChange={setManualEndTime}
          />
        ) : (
          <AutomaticTimer
            isRecording={isRecording}
            elapsedTime={elapsedTime}
            onStartStop={handleStartStop}
          />
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
          <Text style={styles.modeButtonText}>
            {"Ajout automatique"}
          </Text>
        </TouchableOpacity>
                <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
          <Text style={styles.modeButtonText}>
            {"Ajout manuel"}
          </Text>
        </TouchableOpacity>
      </View>
        <FloatingActionButtons
          onCancel={handleCancel}
          onValidate={handleValidate}
        />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  bottomBar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 10,
    gap: 40,
  },
  modeButton: {
    backgroundColor: '#D4D4FF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    flex: 0.5,
  },
  modeButtonText: {
    fontSize: 16,
    color: '#ffffffff',
  },
});