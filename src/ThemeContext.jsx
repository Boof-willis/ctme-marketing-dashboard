import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function themeColors(dark) {
  return dark
    ? {
        bg: '#111111',
        card: '#1a1a1a',
        border: 'rgba(255,255,255,0.1)',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        grid: 'rgba(255,255,255,0.06)',
        axis: '#666',
        tooltipBg: '#1a1a1a',
        tooltipBorder: 'rgba(255,255,255,0.1)',
        tooltipText: '#ffffff',
      }
    : {
        bg: '#f8f9fa',
        card: '#ffffff',
        border: 'rgba(0,0,0,0.1)',
        text: '#111111',
        textSecondary: '#6b7280',
        grid: 'rgba(0,0,0,0.06)',
        axis: '#999',
        tooltipBg: '#ffffff',
        tooltipBorder: 'rgba(0,0,0,0.1)',
        tooltipText: '#111111',
      }
}
