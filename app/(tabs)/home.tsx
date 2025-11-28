import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { getAllActivities } from '@/services/database';
import { Activity } from '@/services/database/types';

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
};

const formatDate = (date: string) => 
  new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

export default function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllActivities()
      .then(setActivities)
      .catch(err => console.error("Erreur chargement:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Chargement</Text>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Aucune activité enregistrée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {activities.map(activity => (
        <View key={activity.id} style={styles.card}>
          <Text style={styles.title}>{activity.title}</Text>
          
          {activity.tagName && (
            <View style={[styles.tag, { backgroundColor: activity.tagColor }]}>
              <Text style={styles.tagText}>{activity.tagName}</Text>
            </View>
          )}
          
          <Text style={styles.duration}>{formatDuration(activity.duration)}</Text>
          <Text style={styles.date}>{formatDate(activity.startTime)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loading: { fontSize: 16, color: '#666' },
  empty: { fontSize: 16, color: '#666', textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#000' },
  tag: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    alignSelf: 'flex-start', 
    marginBottom: 6 
  },
  tagText: { fontSize: 12, fontWeight: '500', color: '#333' },
  duration: { fontSize: 14, color: '#666', marginBottom: 4 },
  date: { fontSize: 12, color: '#999' },
});