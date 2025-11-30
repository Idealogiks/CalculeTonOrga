import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";

import ActivityForm from '@/components/add/ActivityForm';
import AutomaticTimer from '@/components/add/AutomaticTimer';
import ManualTimeInput from '@/components/add/ManualTimeInput';
import FloatingActionButtons from '@/components/add/FloatingActionButtons';
import ModeSelector from '@/components/add/ModeSelector';
import AddCategoryModal from '@/components/add/AddCategoryModal'; 
import WeekCalendar from '@/components/home/WeekCalendar'; 

import { useAddActivity } from '@/hooks/useAddActivity';
import { useThemeColor } from '@/hooks/use-theme-color'; 

export default function AddActivities() {
  const {
    title, setTitle,
    location, setLocation, 
    selectedTag, handleTagPress, tags,
    selectedDate, setSelectedDate, 
    loading,
    isRecording, elapsedTime, handleStartStop,
    isManualMode, handleModeSwitch,
    manualStartTime, setManualStartTime,
    manualEndTime, setManualEndTime,
    handleValidate, handleCancel,
    refreshTags 
  } = useAddActivity();

  const [isModalVisible, setModalVisible] = useState(false);

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
      <WeekCalendar 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ActivityForm
          title={title}
          onTitleChange={setTitle}
          location={location} 
          onLocationChange={setLocation}
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={handleTagPress}
          disabled={isRecording || elapsedTime > 0}
          onAddCategoryPress={() => setModalVisible(true)}
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
            key={isRecording ? 'recording' : `paused-${elapsedTime}`}
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

      <AddCategoryModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          refreshTags();
        }}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 100 },
});