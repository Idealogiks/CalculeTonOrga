import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DailyStat } from '@/hooks/useStatistics';

interface SimpleBarChartProps {
  data: DailyStat[];
}

export default function SimpleBarChart({ data }: SimpleBarChartProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'icon');

  const maxDuration = Math.max(...data.map(d => d.totalDuration), 1); 

  const formatCompactDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    return h > 0 ? `${h}h` : '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const heightPercent = (item.totalDuration / maxDuration) * 100;
          
          return (
            <View key={index} style={styles.column}>
              <Text style={[styles.valueLabel, { color: subTextColor }]}>
                {formatCompactDuration(item.totalDuration)}
              </Text>
              
              <View style={styles.barTrack}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      height: `${heightPercent}%`, 
                      backgroundColor: primaryColor,
                      opacity: item.totalDuration > 0 ? 1 : 0.1 
                    }
                  ]} 
                />
              </View>

              <Text style={[styles.dayLabel, { color: textColor }]}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    paddingVertical: 10,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barTrack: {
    width: 12, 
    height: '70%', 
    backgroundColor: 'rgba(0,0,0,0.03)', 
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 5,
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4, 
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  valueLabel: {
    fontSize: 10,
    marginBottom: 2,
  }
});