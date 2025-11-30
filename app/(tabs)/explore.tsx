import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from 'expo-router';
import { useStatistics } from '@/hooks/useStatistics';
import StatCard from '@/components/explore/StatCard';
import SimpleBarChart from '@/components/explore/SimpleBarChart';
import PieChart from '@/components/explore/PieChart';
import WeekCalendar from '@/components/home/WeekCalendar'; 
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ExploreScreen() {
  const { 
    loading, 
    selectedDate, setSelectedDate, 
    dailyStats, dailyPie, periodChartData, 
    globalStats, globalPie, 
    refresh 
  } = useStatistics();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const dateLabel = format(selectedDate, "d MMMM", { locale: fr });

  const activeDailyStats = dailyStats.filter(stat => stat.value >= 60);
  const activeGlobalStats = globalStats.filter(stat => stat.value >= 60);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      
      <WeekCalendar 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionHeaderTitle, { color: textColor }]}>
          Zoom sur le <Text style={{ fontWeight: 'bold', color: '#6464B3' }}>{dateLabel}</Text>
        </Text>
        
        <View style={styles.gridContainer}>
          {activeDailyStats.length > 0 ? (
            activeDailyStats.map(stat => (
              <StatCard 
                key={stat.id}
                title={stat.label}
                value={formatDuration(stat.value)}
                color={stat.color}
              />
            ))
          ) : (
             <Text style={styles.noDataText}>Aucune activité ce jour-là</Text>
          )}
        </View>

        {dailyPie.length > 0 ? (
          <View style={[styles.section, { backgroundColor: cardColor }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Répartition du jour</Text>
            </View>
            <PieChart data={dailyPie} />
          </View>
        ) : null} 

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Contexte Hebdomadaire</Text>
          </View>
          <SimpleBarChart data={periodChartData} />
        </View>


        <View style={styles.divider} />
        <Text style={[styles.sectionHeaderTitle, { color: textColor }]}>
          Moyennes Globales
        </Text>
        <Text style={styles.headerSubtitle}>Moyenne par jour depuis le début</Text>

        <View style={styles.gridContainer}>
          {activeGlobalStats.length > 0 ? (
            activeGlobalStats.map(stat => (
              <StatCard 
                key={stat.id}
                title={stat.label}
                value={formatDuration(stat.value)}
                color={stat.color}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>Pas encore assez de données</Text>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Répartition Historique</Text>
          </View>
          <PieChart data={globalPie} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  sectionHeaderTitle: { fontSize: 22, fontWeight: '600', marginBottom: 10, marginTop: 10 },
  headerSubtitle: { fontSize: 14, color: '#999', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  noDataText: { textAlign: 'center', color: '#999', marginVertical: 20, fontStyle: 'italic', width: '100%' },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});