import { useState, useEffect, useCallback } from 'react';
import { getAllActivities, getAllTags } from '@/services/database';
import { Activity, Tag } from '@/services/database/types';
import { isSameDay, parseISO, subDays, format, isSameWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface DailyStat {
  day: string;
  date: Date;
  totalDuration: number;
}

export interface CategoryStat {
  name: string;
  color: string;
  totalDuration: number;
  percentage: number;
}

export function useStatistics() {
  const [loading, setLoading] = useState(true);
  const [rawActivities, setRawActivities] = useState<Activity[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [dailySleep, setDailySleep] = useState(0);
  const [dailyWork, setDailyWork] = useState(0); 
  const [dailyPie, setDailyPie] = useState<CategoryStat[]>([]);
  const [periodChartData, setPeriodChartData] = useState<DailyStat[]>([]);

  const [globalAvgSleep, setGlobalAvgSleep] = useState(0);
  const [globalAvgWork, setGlobalAvgWork] = useState(0);
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
    if (rawActivities.length > 0) {
      calculateDailyStats(rawActivities, tags, selectedDate);
    }
  }, [selectedDate, rawActivities]);

  const calculateDailyStats = (data: Activity[], currentTags: Tag[], date: Date) => {
    const dayActivities = data.filter(a => isSameDay(parseISO(a.startTime), date));

    const sleepTag = currentTags.find(t => t.name.toLowerCase().includes('sommeil') || t.name.toLowerCase().includes('dodo'));
    const workTag = currentTags.find(t => t.name.toLowerCase().includes('travail') || t.name.toLowerCase().includes('job') || t.name.toLowerCase().includes('boulot'));

    const sleepActs = dayActivities.filter(a => a.tagId === sleepTag?.id);
    setDailySleep(sleepActs.reduce((acc, curr) => acc + curr.duration, 0));

    const workActs = dayActivities.filter(a => a.tagId === workTag?.id);
    setDailyWork(workActs.reduce((acc, curr) => acc + curr.duration, 0));

    setDailyPie(calculateDistribution(dayActivities, currentTags));

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

  const calculateGlobalStats = (data: Activity[], currentTags: Tag[]) => {
    if (data.length === 0) return;

    const uniqueDays = new Set(data.map(a => a.startTime.substring(0, 10))).size || 1;

    const sleepTag = currentTags.find(t => t.name.toLowerCase().includes('sommeil') || t.name.toLowerCase().includes('dodo'));
    const workTag = currentTags.find(t => t.name.toLowerCase().includes('travail') || t.name.toLowerCase().includes('job') || t.name.toLowerCase().includes('boulot'));

    const totalSleep = data
      .filter(a => a.tagId === sleepTag?.id)
      .reduce((acc, curr) => acc + curr.duration, 0);
    setGlobalAvgSleep(totalSleep / uniqueDays);

    const totalWork = data
      .filter(a => a.tagId === workTag?.id)
      .reduce((acc, curr) => acc + curr.duration, 0);
    setGlobalAvgWork(totalWork / uniqueDays);

    setGlobalPie(calculateDistribution(data, currentTags));
  };

  const calculateDistribution = (acts: Activity[], tgs: Tag[]) => {
    const totalTime = acts.reduce((acc, curr) => acc + curr.duration, 0);
    if (totalTime === 0) return [];

    return tgs.map(tag => {
      const tagDuration = acts
        .filter(a => a.tagId === tag.id)
        .reduce((acc, curr) => acc + curr.duration, 0);
        
      return {
        name: tag.name,
        color: tag.color,
        totalDuration: tagDuration,
        percentage: Math.round((tagDuration / totalTime) * 1000) / 10
      };
    })
    .filter(s => s.totalDuration > 0)
    .sort((a, b) => b.totalDuration - a.totalDuration);
  };

  return {
    loading,
    selectedDate, setSelectedDate, 
    
    dailySleep,
    dailyWork,
    dailyPie,
    periodChartData,

    globalAvgSleep,
    globalAvgWork,
    globalPie,

    rawActivities,
    refresh,
  };
}