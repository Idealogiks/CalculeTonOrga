import { useState, useEffect, useCallback } from 'react';
import { getAllActivities, getAllTags } from '@/services/database';
import { Activity, Tag } from '@/services/database/types';
import { isSameDay, parseISO, subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface DailyStat {
  day: string;
  date: Date;
  totalDuration: number;
}

export interface CategoryStat {
  id: number;
  name: string;
  color: string;
  totalDuration: number;
  percentage: number;
}

// ✅ Nouvelle interface pour les items de stats (cartes)
export interface StatItem {
  id: number;
  label: string;
  value: number; // en secondes
  color: string;
}

export function useStatistics() {
  const [loading, setLoading] = useState(true);
  const [rawActivities, setRawActivities] = useState<Activity[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- STATS DYNAMIQUES (Tableaux) ---
  const [dailyStats, setDailyStats] = useState<StatItem[]>([]);
  const [dailyPie, setDailyPie] = useState<CategoryStat[]>([]);
  const [periodChartData, setPeriodChartData] = useState<DailyStat[]>([]);

  // --- MOYENNES GLOBALES (Tableaux) ---
  const [globalStats, setGlobalStats] = useState<StatItem[]>([]);
  const [globalPie, setGlobalPie] = useState<CategoryStat[]>([]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const [allActivities, allTags] = await Promise.all([
        getAllActivities(),
        getAllTags()
      ]);
      
      setRawActivities(allActivities);
      setTags(allTags);
      
      calculateGlobalStats(allActivities, allTags);
    } catch (e) {
      console.error("Erreur calcul stats", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tags.length > 0) { // Calculer même si 0 activités pour afficher 0h
      calculateDailyStats(rawActivities, tags, selectedDate);
    }
  }, [selectedDate, rawActivities, tags]);

  // --- 1. CALCULS DU JOUR ---
  const calculateDailyStats = (data: Activity[], currentTags: Tag[], date: Date) => {
    const dayActivities = data.filter(a => isSameDay(parseISO(a.startTime), date));

    // a) Stats pour CHAQUE catégorie ce jour-là
    const stats = currentTags.map(tag => {
        const duration = dayActivities
            .filter(a => a.tagId === tag.id)
            .reduce((acc, curr) => acc + curr.duration, 0);
        return {
            id: tag.id,
            label: tag.name,
            value: duration,
            color: tag.color
        };
    });
    setDailyStats(stats);

    // b) Camembert du jour
    const totalDayTime = dayActivities.reduce((acc, curr) => acc + curr.duration, 0);
    const pieData = stats
        .filter(s => s.value > 0)
        .map(s => ({
            id: s.id,
            name: s.label,
            color: s.color,
            totalDuration: s.value,
            percentage: totalDayTime > 0 ? Math.round((s.value / totalDayTime) * 1000) / 10 : 0
        }))
        .sort((a, b) => b.totalDuration - a.totalDuration);
    setDailyPie(pieData);

    // c) Graphique Semaine
    const chartData: DailyStat[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(date, i);
      const dActivities = data.filter(a => isSameDay(parseISO(a.startTime), d));
      const dTotal = dActivities.reduce((acc, curr) => acc + curr.duration, 0);
      chartData.push({
        day: format(d, 'EE', { locale: fr }),
        date: d,
        totalDuration: dTotal
      });
    }
    setPeriodChartData(chartData);
  };

  // --- 2. CALCULS GLOBAUX ---
  const calculateGlobalStats = (data: Activity[], currentTags: Tag[]) => {
    const uniqueDays = new Set(data.map(a => a.startTime.substring(0, 10))).size || 1;

    // a) Moyenne par jour pour CHAQUE catégorie
    const stats = currentTags.map(tag => {
        const totalDuration = data
            .filter(a => a.tagId === tag.id)
            .reduce((acc, curr) => acc + curr.duration, 0);
        return {
            id: tag.id,
            label: tag.name,
            value: totalDuration / uniqueDays, // Moyenne
            color: tag.color
        };
    });
    setGlobalStats(stats);

    // b) Camembert Global
    const totalTime = data.reduce((acc, curr) => acc + curr.duration, 0);
    const pieData = stats
        .filter(s => s.value > 0)
        .map(s => ({
            id: s.id,
            name: s.label,
            color: s.color,
            totalDuration: s.value * uniqueDays,
            percentage: totalTime > 0 ? Math.round(((s.value * uniqueDays) / totalTime) * 1000) / 10 : 0
        }))
        .sort((a, b) => b.totalDuration - a.totalDuration);
    setGlobalPie(pieData);
  };

  return {
    loading,
    selectedDate, setSelectedDate,
    
    dailyStats, // ✅ Liste complète des catégories du jour
    dailyPie,
    periodChartData,

    globalStats, // ✅ Liste complète des moyennes globales
    globalPie,

    rawActivities,
    refresh,
  };
}