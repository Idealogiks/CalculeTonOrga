import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useActivities } from '@/hooks/useActivities';
import { useThemeColor } from '@/hooks/use-theme-color';

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
  const { activities, loading } = useActivities();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'icon'); 

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
        <Text style={[styles.loading, { color: subTextColor }]}>Chargement...</Text>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <Text style={[styles.empty, { color: subTextColor }]}>Aucune activité enregistrée</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {activities.map(activity => (
        <View key={activity.id} style={[styles.card, { backgroundColor: cardColor }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: textColor }]}>{activity.title}</Text>
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loading: { fontSize: 16, marginTop: 10 },
  empty: { fontSize: 16, textAlign: 'center' },
  
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