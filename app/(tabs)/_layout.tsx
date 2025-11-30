import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="clock-circle" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="plus" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
