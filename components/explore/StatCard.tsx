import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import AntDesign from '@expo/vector-icons/AntDesign';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

export default function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'icon');
  const defaultColor = useThemeColor({}, 'primary');

  const iconColor = color || defaultColor;

  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
      </View>
      <View>
        <Text style={[styles.label, { color: subTextColor }]}>{title}</Text>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: subTextColor }]}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    gap: 10,
    minWidth: '45%',
    // Ombres légères
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  }
});