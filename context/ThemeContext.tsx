// context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeContextProps {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
