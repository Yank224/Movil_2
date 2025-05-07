// app/_layout.tsx
import React, { useEffect } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  )
}

function Inner() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      {/* El Stack de expo-router crea internamente el NavigationContainer */}
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  )
}
