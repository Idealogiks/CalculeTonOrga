import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import * as db from '@/services/database';
import { Activity } from '@/services/database/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ActivityDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const primaryColor = useThemeColor({}, 'primary');
  const subTextColor = useThemeColor({}, 'icon');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id])
  );

  const loadData = async () => {
    try {
      const data = await db.getActivityById(Number(id));
      setActivity(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  if (!activity) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: textColor }}>Activité introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={{ padding: 20 }}>
      <Stack.Screen 
        options={{
          headerTitle: "Détails",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push(`/activities/edit/${id}`)} 
              style={{ padding: 5 }}
            >
              <Text style={{ color: primaryColor, fontSize: 16, fontWeight: '600' }}>Modifier</Text>
            </TouchableOpacity>
          )
        }} 
      />

      <Text style={[styles.title, { color: textColor }]}>{activity.title}</Text>

      {activity.location ? (
        <View style={styles.locationRow}>
          <AntDesign name="environment" size={18} color={subTextColor} style={{ marginRight: 5 }} />
          <Text style={[styles.locationText, { color: subTextColor }]}>{activity.location}</Text>
        </View>
      ) : null}

      {activity.tagName && (
        <View style={[styles.tagContainer, { backgroundColor: activity.tagColor || '#ccc' }]}>
          <Text style={styles.tagText}>{activity.tagName}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: cardColor }]}>
          <AntDesign name="clock-circle" size={24} color={primaryColor} style={{ marginBottom: 8 }} />
          <Text style={[styles.statLabel, { color: subTextColor }]}>Durée</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {formatDuration(activity.duration)}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: cardColor }]}>
          <AntDesign name="calendar" size={24} color={primaryColor} style={{ marginBottom: 8 }} />
          <Text style={[styles.statLabel, { color: subTextColor }]}>Date</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {format(new Date(activity.startTime), 'd MMM', { locale: fr })}
          </Text>
        </View>
      </View>

      <View style={[styles.detailsCard, { backgroundColor: cardColor }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: subTextColor }]}>Début</Text>
          <Text style={[styles.value, { color: textColor }]}>
            {format(new Date(activity.startTime), 'PPpp', { locale: fr })}
          </Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: '#eee', marginVertical: 10 }]} />
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: subTextColor }]}>Fin</Text>
          <Text style={[styles.value, { color: textColor }]}>
            {format(new Date(activity.endTime), 'PPpp', { locale: fr })}
          </Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagContainer: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 20,
    marginBottom: 20
  },
  tagText: { fontSize: 16, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: 'transparent', marginBottom: 20 },
  
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statLabel: { fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { fontSize: 18, fontWeight: '700' },

  detailsCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: '500' }
});