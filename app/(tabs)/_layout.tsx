// app/(tabs)/_layout.tsx
import React from 'react'
import { Platform } from 'react-native'
import { Tabs } from 'expo-router'

import { LanguageProvider } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'

export default function TabLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <LanguageProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isDark ? '#fff' : '#000',
          tabBarInactiveTintColor: isDark ? '#888' : '#666',
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
            borderTopColor: isDark ? '#333' : '#ccc',
            ...(Platform.OS === 'ios' ? { position: 'absolute' } : {}),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => (
              <IconSymbol name="house.fill" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => (
              // Usamos magnifyingglass que sí es SF Symbol
              <IconSymbol name="magnifyingglass" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favoritos"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color }) => (
              // star / star.fill
              <IconSymbol name="star.fill" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </LanguageProvider>
  )
}
