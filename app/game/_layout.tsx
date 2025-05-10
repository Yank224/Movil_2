// app/game/_layout.tsx

import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { LanguageProvider } from '../../context/LanguageContext'
import SettingsMenu from '../components/SettingsMenu'

export default function GameLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()

  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
      >
        <Stack.Screen
          name="[id]"
          options={{
            title: '',
            // Oculta el texto del back, dejamos solo la flecha
            headerBackTitle: '',

            // Botón izquierda: flecha atrás
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={styles.leftButton}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={isDark ? '#fff' : '#000'}
                />
              </Pressable>
            ),

            // Botón derecha: engranaje que levanta tu SettingsMenu
            headerRight: () => (
              <Pressable style={styles.rightButton}>
                <SettingsMenu />
              </Pressable>
            ),
          }}
        />
      </Stack>
    </LanguageProvider>
  )
}

const styles = StyleSheet.create({
  leftButton: {
    marginLeft: 16,
  },
  rightButton: {
    marginRight: 16,
  },
})
