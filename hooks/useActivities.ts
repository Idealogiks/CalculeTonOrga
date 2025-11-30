import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAllActivities } from '@/services/database';
import { Activity } from '@/services/database/types';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    getAllActivities()
      .then(setActivities)
      .catch(err => console.error("Erreur chargement:", err))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return { activities, loading, refetch: loadData };
}