import React from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";

import ActivityForm from '@/components/add/ActivityForm';
import AutomaticTimer from '@/components/add/AutomaticTimer';
import ManualTimeInput from '@/components/add/ManualTimeInput';
import FloatingActionButtons from '@/components/add/FloatingActionButtons';
import ModeSelector from '@/components/add/ModeSelector';

import { useAddActivity } from '@/hooks/useAddActivity';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AddActivities() {
  const {
    title, setTitle,
    selectedTag, handleTagPress, tags,
    loading,
    isRecording, elapsedTime, handleStartStop,
    isManualMode, handleModeSwitch,
    manualStartTime, setManualStartTime,
    manualEndTime, setManualEndTime,
    handleValidate, handleCancel
  } = useAddActivity();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
        <Text style={{ color: textColor, marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
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

      <ModeSelector 
        isManual={isManualMode} 
        onSwitch={handleModeSwitch} 
      />

      <FloatingActionButtons
        onCancel={handleCancel}
        onValidate={handleValidate}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
});