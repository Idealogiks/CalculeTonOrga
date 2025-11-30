import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as db from '@/services/database';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, Easing } from 'react-native-reanimated';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const insets = useSafeAreaInsets();
  
  const [markedDates, setMarkedDates] = useState<{[key: string]: any}>({});
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  
  const calendarHeight = useSharedValue(0);
  const weekOpacity = useSharedValue(1);

  const primaryColor = useThemeColor({}, 'primary'); 
  const secondaryColor = '#E8E5FF'; 
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background'); 

  useEffect(() => {
    loadMarks();
  }, [selectedDate]);

  const loadMarks = async () => {
    try {
      const dates = (db as any).getDatesWithActivities ? await (db as any).getDatesWithActivities() : [];
      const marks: any = {};

      dates.forEach((date: string) => {
        marks[date] = { 
          customStyles: { 
            container: { backgroundColor: secondaryColor, borderRadius: 20 },
            text: { color: '#333' }
          } 
        };
      });

      const currentStr = format(selectedDate, 'yyyy-MM-dd');
      marks[currentStr] = {
        customStyles: {
          container: { backgroundColor: primaryColor, borderRadius: 20, elevation: 4 },
          text: { color: 'white', fontWeight: 'bold' }
        }
      };
      setMarkedDates(marks);
    } catch (e) {  }
  };

  const toggleMonthView = () => {
    const opening = !isMonthOpen;
    setIsMonthOpen(opening);

    calendarHeight.value = withTiming(opening ? 350 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    
    weekOpacity.value = withTiming(opening ? 0 : 1, { duration: 200 });
  };

  const calendarStyle = useAnimatedStyle(() => ({
    height: calendarHeight.value,
    opacity: calendarHeight.value === 0 ? 0 : 1,
    overflow: 'hidden',
  }));

  const weekStyle = useAnimatedStyle(() => ({
    opacity: weekOpacity.value,
    height: weekOpacity.value === 0 ? 0 : 'auto', 
    marginBottom: weekOpacity.value === 0 ? 0 : 10
  }));

  const renderWeekRow = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

    return (
      <Animated.View style={[styles.weekRow, weekStyle]}>
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayContainer, 
                { backgroundColor: isSelected ? '#D4D4FF' : '#F8F8F8' }
              ]}
              onPress={() => onDateSelect(day)}
            >
              <Text style={[styles.dayText, { color: isSelected ? '#000' : '#333' }]}>
                {format(day, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top + 10, backgroundColor }
    ]}>
      
      {renderWeekRow()}

      <Animated.View style={calendarStyle}>
        <Calendar
          current={format(selectedDate, 'yyyy-MM-dd')}
          onDayPress={(day: any) => {
            onDateSelect(parseISO(day.dateString));
            toggleMonthView();
          }}
          markingType={'custom'}
          markedDates={markedDates}
          firstDay={1} 
          theme={{
            arrowColor: primaryColor,
            todayTextColor: primaryColor,
            textDayFontWeight: '500',
            calendarBackground: 'transparent',
            textSectionTitleColor: '#b6c1cd',
            textMonthFontSize: 0.1, 
            monthTextColor: 'transparent',
          }}
          hideExtraDays={true}
        />
      </Animated.View>

      <TouchableOpacity onPress={toggleMonthView} style={styles.header}>
        <Text style={[styles.headerText, { color: textColor }]}>
          {format(selectedDate, 'd MMMM', { locale: fr })}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 10,
    overflow: 'hidden'
  },
  header: {
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '400',
  }
});