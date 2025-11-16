"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// --- Unified Settings Type ---
export interface SettingsConfig {
  theme: "dark" | "light" | "auto"
  refreshInterval: number
  animationsEnabled: boolean
  compactMode: boolean
  defaultDashboard: string
  emailAlerts: boolean
  pushNotifications: boolean
  smsAlerts: boolean
  severityThreshold: string
  dailySummary: boolean
  cpuThreshold: number
  memoryThreshold: number
  autoMitigation: boolean
  logRetention: number
  autoRestartAgents: boolean
  apiEndpoint: string
  wsUrl: string
  authToken: string
  siemEnabled: boolean
  cloudBackup: boolean
  threatFeed: boolean
}

// --- Default Settings ---
const defaultSettings: SettingsConfig = {
  theme: "dark",
  refreshInterval: 10,
  animationsEnabled: true,
  compactMode: false,
  defaultDashboard: "Overview",
  emailAlerts: true,
  pushNotifications: false,
  smsAlerts: false,
  severityThreshold: "Medium",
  dailySummary: true,
  cpuThreshold: 80,
  memoryThreshold: 80,
  autoMitigation: false,
  logRetention: 14,
  autoRestartAgents: true,
  apiEndpoint: "https://api.wraithnet.local",
  wsUrl: "wss://ws.wraithnet.local",
  authToken: "",
  siemEnabled: false,
  cloudBackup: false,
  threatFeed: false,
}

// --- Context Definition ---
interface SettingsContextType {
  settings: SettingsConfig
  updateSettings: (updates: Partial<SettingsConfig>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsConfig>(defaultSettings)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("systemSettings")
    if (saved) setSettings(JSON.parse(saved))
  }, [])

  // Update localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("systemSettings", JSON.stringify(settings))
  }, [settings])

  // Update method
  const updateSettings = (updates: Partial<SettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider")
  return context
}
