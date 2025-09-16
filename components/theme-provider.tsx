"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    
    // 初始化时从localStorage读取主题
    const savedTheme = localStorage.getItem(storageKey) as Theme | null
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme)
      return
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    
    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove("light", "dark")
      
      if (currentTheme === "dark") {
        root.classList.add("dark")
      } else if (currentTheme === "light") {
        root.classList.add("light")
      } else if (currentTheme === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.classList.add(systemPrefersDark ? "dark" : "light")
      }
    }

    applyTheme(theme)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}