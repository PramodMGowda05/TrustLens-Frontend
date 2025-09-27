"use client"

import * as React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
}

type ThemeProviderState = {
  theme: string
  setTheme: (theme: string) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  attribute = "class",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    return localStorage.getItem(storageKey) || defaultTheme
  })
  
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  

  React.useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    let systemTheme: string = theme;
    if (theme === "system" && enableSystem) {
        const mql = window.matchMedia("(prefers-color-scheme: dark)")
        systemTheme = mql.matches ? "dark" : "light"
    }

    root.classList.add(systemTheme)
  }, [theme, enableSystem, mounted])

  const value = {
    theme,
    setTheme: (theme: string) => {
      if(typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme)
      }
      setTheme(theme)
    },
  }

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
