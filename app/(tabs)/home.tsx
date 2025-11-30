import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useActivities } from '@/hooks/useActivities';
import { useThemeColor } from '@/hooks/use-theme-color'; 
import { Stack, useRouter } from 'expo-router'; 
import { resetDatabase, getAllTags } from '@/services/database'; 
import WeekCalendar from '@/components/home/WeekCalendar';
import { isSameDay, parseISO } from 'date-fns';
import { Tag } from '@/services/database/types';

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
};

const formatDate = (date: string) => 
  new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

export default function HomeScreen() {
  const router = useRouter();
  const { activities, loading, refetch } = useActivities();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primary');

  useEffect(() => {
    getAllTags().then(setTags).catch(console.error);
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesDate = isSameDay(parseISO(activity.startTime), selectedDate);
    const matchesCategory = selectedTagId === null || activity.tagId === selectedTagId;
    return matchesDate && matchesCategory;
  });

  const handleResetPress = () => {
    Alert.alert(
      "Réinitialiser l'application ?",
      "Cela effacera toutes tes activités et tes catégories personnalisées.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Tout effacer", 
          style: "destructive", 
          onPress: async () => {
            await resetDatabase();
            refetch(); 
            getAllTags().then(setTags);
          }
        }
      ]
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={textColor} />
          <Text style={[styles.loading, { color: subTextColor }]}>Chargement...</Text>
        </View>
      );
    }

    if (filteredActivities.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={[styles.empty, { color: subTextColor }]}>
            Rien
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredActivities.map(activity => (
          <TouchableOpacity 
            key={activity.id}
            activeOpacity={0.7}
            onPress={() => router.push({
                  pathname: "/activities/[id]", 
                  params: { id: activity.id }  
                })}
          >
            <View style={[styles.card, { backgroundColor: cardColor }]}>
              
              <View style={styles.headerRow}>
                <Text style={[styles.title, { color: textColor }]}>
                  {activity.title}
                </Text>
                
                {activity.tagName && (
                  <View style={[styles.tag, { backgroundColor: activity.tagColor }]}>
                    <Text style={styles.tagText}>{activity.tagName}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.infoRow}>
                <Text style={[styles.duration, { color: subTextColor }]}>
                  ⏱ {formatDuration(activity.duration)}
                </Text>
                <Text style={[styles.date, { color: subTextColor }]}>
                  📅 {formatDate(activity.startTime)}
                </Text>
              </View>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen 
        options={{
          headerTitle: "", 
          headerShadowVisible: false,
          headerStyle: { backgroundColor },
          headerRight: () => (
            <TouchableOpacity onPress={handleResetPress} style={{ marginRight: 10, padding: 5 }}>
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          )
        }} 
      />

      <WeekCalendar 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedTagId === null ? { backgroundColor: primaryColor } : { backgroundColor: cardColor, borderWidth: 1, borderColor: '#eee' }
            ]}
            onPress={() => setSelectedTagId(null)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedTagId === null ? 'white' : textColor }
            ]}>
              Tous
            </Text>
          </TouchableOpacity>

          {tags.map(tag => {
            const isSelected = selectedTagId === tag.id;
            return (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.filterChip,
                  isSelected ? { backgroundColor: tag.color } : { backgroundColor: cardColor, borderWidth: 1, borderColor: '#eee' }
                ]}
                onPress={() => setSelectedTagId(isSelected ? null : tag.id)}
              >
                <Text style={[
                  styles.filterText,
                  { color: isSelected ? 'white' : textColor }
                ]}>
                  {tag.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loading: { fontSize: 16, marginTop: 10 },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 50 },
  
  filterContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: { 
    fontSize: 17, 
    fontWeight: '600', 
    flex: 1, 
    marginRight: 10 
  },
  tag: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
  },
  tagText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333' 
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  duration: { fontSize: 14, fontWeight: '500' },
  date: { fontSize: 12 },
});