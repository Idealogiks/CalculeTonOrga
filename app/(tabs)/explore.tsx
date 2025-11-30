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
    dailySleep, dailyWork, dailyPie, periodChartData, 
    globalAvgSleep, globalAvgWork, globalPie, 
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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      
      {/* 1. CALENDRIER */}
      <WeekCalendar 
        selectedDate={selectedDate} 
        onDateSelect={setSelectedDate} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- SECTION JOUR SÉLECTIONNÉ --- */}
        <Text style={[styles.sectionHeaderTitle, { color: textColor }]}>
          Zoom sur le <Text style={{ fontWeight: 'bold', color: '#6464B3' }}>{dateLabel}</Text>
        </Text>
        
        {/* Cartes Résumé Jour */}
        <View style={styles.cardsRow}>
          <StatCard 
            title="Sommeil" 
            value={formatDuration(dailySleep)} 
            subtitle="cette nuit-là"
            color="#6464B3"
          />
          <StatCard 
            title="Travail" 
            value={formatDuration(dailyWork)} 
            subtitle="ce jour-là"
            color="#FF9F43"
          />
        </View>

        {/* Camembert Jour */}
        {dailyPie.length > 0 ? (
          <View style={[styles.section, { backgroundColor: cardColor }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Répartition du jour</Text>
            </View>
            <PieChart data={dailyPie} />
          </View>
        ) : (
          <Text style={styles.noDataText}>Aucune activité ce jour-là</Text>
        )}

        {/* Graphique Semaine */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Contexte Hebdomadaire</Text>
          </View>
          <SimpleBarChart data={periodChartData} />
        </View>


        {/* --- SECTION MOYENNES GLOBALES --- */}
        <View style={styles.divider} />
        <Text style={[styles.sectionHeaderTitle, { color: textColor }]}>
          Moyennes Globales
        </Text>
        <Text style={styles.headerSubtitle}>Depuis le début</Text>

        <View style={styles.cardsRow}>
          <StatCard 
            title="Moyenne Sommeil" 
            value={formatDuration(globalAvgSleep)} 
            subtitle="par jour"
            color="#888"
          />
          <StatCard 
            title="Moyenne Travail" 
            value={formatDuration(globalAvgWork)} 
            subtitle="par jour"
            color="#888"
          />
        </View>

        {/* Camembert Global */}
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
  noDataText: { textAlign: 'center', color: '#999', marginVertical: 20, fontStyle: 'italic' },

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
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