// app/game/_layout.tsx
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function GameLayout() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
          headerTintColor: isDark ? '#fff' : '#000',
          headerBackTitle: '',

          // Botón izquierda: retroceder
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.leftButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDark ? '#fff' : '#000'}
              />
            </Pressable>
          ),

          // Botón derecha: toggle tema
          headerRight: () => (
            <Pressable
              onPress={() => setTheme(isDark ? 'light' : 'dark')}
              style={styles.rightButton}
            >
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={24}
                color={isDark ? '#fff' : '#000'}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
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
