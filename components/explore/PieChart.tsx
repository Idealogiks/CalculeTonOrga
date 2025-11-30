import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { CategoryStat } from '@/hooks/useStatistics';
import { useThemeColor } from '@/hooks/use-theme-color';

interface PieChartProps {
  data: CategoryStat[];
}

export default function PieChart({ data }: PieChartProps) {
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'icon');

  const radius = 70;
  const center = 80;
  
  let startAngle = 0;
  const arcs = data.map((item, index) => {
    const angle = (item.percentage / 100) * 360;
    const endAngle = startAngle + angle;

    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

    startAngle = endAngle;

    return (
      <Path
        key={item.name}
        d={pathData}
        fill={item.color}
        stroke="white"
        strokeWidth="2"
      />
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg height="160" width="160">
          <G rotation="-90" origin={`${center}, ${center}`}>
            {arcs}
          </G>
          <G>
             <Path 
               d={`M${center},${center} m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0`} 
               fill="white" 
             />
          </G>
        </Svg>
      </View>

      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <View>
              <Text style={[styles.percentage, { color: textColor }]}>
                {item.percentage}%
              </Text>
              <Text style={[styles.label, { color: subTextColor }]}>
                {item.name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    textTransform: 'capitalize',
  }
});