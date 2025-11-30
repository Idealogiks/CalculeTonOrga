import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as db from '@/services/database';
import { Tag } from '@/services/database/types';

export function useAddActivity() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualStartTime, setManualStartTime] = useState(new Date());
  const [manualEndTime, setManualEndTime] = useState(new Date());

  const loadTags = useCallback(() => {
    db.getAllTags()
      .then(setTags)
      .catch(() => Alert.alert("Erreur", "Impossible de charger les tags"));
  }, []);

  useEffect(() => {
    db.initDatabase()
      .then(() => {
        loadTags(); 
      })
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setIsRecording(false);
    setStartTime(null);
    setElapsedTime(0);
    setTitle("");
    setLocation("");
    setSelectedTag(null);
    setManualStartTime(new Date());
    setManualEndTime(new Date());
  };

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
      activityStartTime = new Date(selectedDate);
      activityStartTime.setHours(manualStartTime.getHours());
      activityStartTime.setMinutes(manualStartTime.getMinutes());
      activityStartTime.setSeconds(0);

      activityEndTime = new Date(selectedDate);
      activityEndTime.setHours(manualEndTime.getHours());
      activityEndTime.setMinutes(manualEndTime.getMinutes());
      activityEndTime.setSeconds(0);

      if (activityEndTime.getTime() < activityStartTime.getTime()) {
        activityEndTime.setDate(activityEndTime.getDate() + 1);
      }
      
      totalDuration = Math.floor((activityEndTime.getTime() - activityStartTime.getTime()) / 1000);
      
      if (totalDuration <= 0) {
        Alert.alert("Erreur", "La durée calculée est invalide.");
        return;
      }

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

      const now = new Date();
      activityEndTime = new Date(selectedDate);
      activityEndTime.setHours(now.getHours());
      activityEndTime.setMinutes(now.getMinutes());
      activityEndTime.setSeconds(now.getSeconds());

      activityStartTime = new Date(activityEndTime.getTime() - (totalDuration * 1000));
    }

    const tag = tags.find(t => t.id === selectedTag);
    const activityName = title || tag?.name || "Activité";

    try {
      await db.createActivity({
        title: activityName,
        location: location,
        startTime: activityStartTime.toISOString(),
        endTime: activityEndTime.toISOString(),
        duration: totalDuration,
        isManual: isManualMode,
        tagId: selectedTag
      });

      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const seconds = totalDuration % 60;
      const displayDuration = hours > 0 
        ? `${hours}h ${minutes}m` 
        : `${minutes}m ${seconds}s`;

      Alert.alert("Enregistré", `${activityName}\n${displayDuration}`);
      resetForm();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder");
    }
  };

  const handleCancel = () => {
    Alert.alert("Annuler", "Voulez-vous annuler ?", [
      { text: "Non", style: "cancel" },
      { text: "Oui", style: "destructive", onPress: resetForm }
    ]);
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

  const handleModeSwitch = (manual: boolean) => {
     if (isRecording || elapsedTime > 0) {
        Alert.alert("Attention", "Terminez ou annulez l'activité en cours");
        return;
      }
      setIsManualMode(manual);
  };

  return {
    title, setTitle,
    location, setLocation,
    selectedTag,
    tags,
    selectedDate, setSelectedDate,
    loading,
    isRecording,
    elapsedTime,
    isManualMode,
    manualStartTime, setManualStartTime,
    manualEndTime, setManualEndTime,
    handleStartStop,
    handleValidate,
    handleCancel,
    handleTagPress,
    handleModeSwitch,
    refreshTags: loadTags
  };
}