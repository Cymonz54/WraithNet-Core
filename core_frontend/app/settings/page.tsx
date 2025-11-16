"use client"

import { useState, useEffect, ChangeEvent } from "react"
import {
  Save,
  X,
  Upload,
  Download,
  Settings,
  Bell,
  Shield,
  Cloud,
  Server,
} from "lucide-react"
import { useSettings } from "@/context/SettingsContext"

// Import the types from the context to ensure consistency
import type { SettingsConfig } from "@/context/SettingsContext"

export default function SettingsPage() {
  const { settings: globalSettings, updateSettings } = useSettings()
  const [config, setConfig] = useState<SettingsConfig>(globalSettings)

  // Load saved config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("systemSettings")
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved) as SettingsConfig
        setConfig(parsedConfig)
      } catch {
        // Use default if parsing fails
        setConfig(globalSettings)
      }
    }
  }, [globalSettings])

  // Save current config
  const saveConfig = () => {
    localStorage.setItem("systemSettings", JSON.stringify(config))
    updateSettings(config)
    alert("✅ Settings saved successfully!")
  }

  // Discard changes
  const discardChanges = () => {
    setConfig(globalSettings)
    alert("🔄 Changes discarded.")
  }

  // Export config as JSON
  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "system-settings-backup.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import config from JSON file
  const restoreConfig = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const restored = JSON.parse(event.target?.result as string) as SettingsConfig
        setConfig(restored)
        localStorage.setItem("systemSettings", JSON.stringify(restored))
        updateSettings(restored)
        alert("✅ Settings restored from file!")
      } catch {
        alert("❌ Invalid configuration file.")
      }
    }
    reader.readAsText(file)
  }

  // Toggle boolean keys
  const toggle = (key: keyof SettingsConfig) =>
    setConfig({ ...config, [key]: !config[key] })

  return (
    <div className="space-y-6">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Settings className="w-6 h-6" /> Settings
        </h1>
        <p className="text-sm text-gray-400">
          Manage configurations, notifications, integrations, and preferences.
        </p>
      </div>

      {/* --- System Preferences --- */}
      <Section
        title="System Preferences"
        icon={<Server className="w-5 h-5 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Theme"
            value={config.theme}
            options={["dark", "light", "auto"]}
            onChange={(v) => setConfig({ ...config, theme: v as "dark" | "light" | "auto" })}
          />
          <Select
            label="Refresh Interval (seconds)"
            value={String(config.refreshInterval)}
            options={["5", "10", "30", "60"]}
            onChange={(v) =>
              setConfig({ ...config, refreshInterval: Number(v) })
            }
          />
          <Toggle
            label="Enable Animations"
            checked={config.animationsEnabled}
            onChange={() => toggle("animationsEnabled")}
          />
          <Toggle
            label="Enable Compact Mode"
            checked={config.compactMode}
            onChange={() => toggle("compactMode")}
          />
          <Select
            label="Default Dashboard"
            value={config.defaultDashboard}
            options={["Overview", "Telemetry", "Proactive Defense"]}
            onChange={(v) =>
              setConfig({ ...config, defaultDashboard: v })
            }
          />
        </div>
      </Section>

      {/* --- Notifications --- */}
      <Section
        title="Notification Settings"
        icon={<Bell className="w-5 h-5 text-yellow-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            label="Email Alerts"
            checked={config.emailAlerts}
            onChange={() => toggle("emailAlerts")}
          />
          <Toggle
            label="Push Notifications"
            checked={config.pushNotifications}
            onChange={() => toggle("pushNotifications")}
          />
          <Toggle
            label="SMS Alerts"
            checked={config.smsAlerts}
            onChange={() => toggle("smsAlerts")}
          />
          <Select
            label="Severity Threshold"
            value={config.severityThreshold}
            options={["Low", "Medium", "High", "Critical"]}
            onChange={(v) =>
              setConfig({ ...config, severityThreshold: v as "Low" | "Medium" | "High" | "Critical" })
            }
          />
          <Toggle
            label="Daily Summary Report"
            checked={config.dailySummary}
            onChange={() => toggle("dailySummary")}
          />
        </div>
      </Section>

      {/* --- Defense & Monitoring --- */}
      <Section
        title="Defense & Monitoring"
        icon={<Shield className="w-5 h-5 text-green-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CPU Usage Threshold (%)"
            value={config.cpuThreshold}
            onChange={(v) =>
              setConfig({ ...config, cpuThreshold: Number(v) })
            }
          />
          <Input
            label="Memory Usage Threshold (%)"
            value={config.memoryThreshold}
            onChange={(v) =>
              setConfig({ ...config, memoryThreshold: Number(v) })
            }
          />
          <Toggle
            label="Enable Auto-Mitigation"
            checked={config.autoMitigation}
            onChange={() => toggle("autoMitigation")}
          />
          <Select
            label="Log Retention (days)"
            value={config.logRetention}
            options={[7, 14, 30]}
            onChange={(v) =>
              setConfig({ ...config, logRetention: Number(v) as 7 | 14 | 30 })
            }
          />
          <Toggle
            label="Enable Agent Auto-Restart"
            checked={config.autoRestartAgents}
            onChange={() => toggle("autoRestartAgents")}
          />
        </div>
      </Section>

      {/* --- API & Integrations --- */}
      <Section
        title="API & Integrations"
        icon={<Cloud className="w-5 h-5 text-blue-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="API Endpoint"
            value={config.apiEndpoint}
            onChange={(v) => setConfig({ ...config, apiEndpoint: v })}
          />
          <Input
            label="WebSocket URL"
            value={config.wsUrl}
            onChange={(v) => setConfig({ ...config, wsUrl: v })}
          />
          <Input
            label="Auth Token"
            type="password"
            value={config.authToken}
            onChange={(v) => setConfig({ ...config, authToken: v })}
          />
          <Toggle
            label="Enable SIEM Integration"
            checked={config.siemEnabled}
            onChange={() => toggle("siemEnabled")}
          />
          <Toggle
            label="Enable Cloud Backup"
            checked={config.cloudBackup}
            onChange={() => toggle("cloudBackup")}
          />
          <Toggle
            label="Enable Threat Intelligence Feed"
            checked={config.threatFeed}
            onChange={() => toggle("threatFeed")}
          />
        </div>
      </Section>

      {/* --- Backup & Restore --- */}
      <Section
        title="Backup & Restore"
        icon={<Download className="w-5 h-5 text-cyan-400" />}
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportConfig}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Config (JSON)
          </button>
          <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Restore Config
            <input
              type="file"
              accept="application/json"
              onChange={restoreConfig}
              className="hidden"
            />
          </label>
        </div>
      </Section>

      {/* --- Save / Discard Buttons --- */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={saveConfig}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
        <button
          onClick={discardChanges}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Discard Changes
        </button>
      </div>
    </div>
  )
}

// --- Reusable Components ---
function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2 mb-4">
        {icon} {title}
      </h2>
      {children}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between text-gray-300 bg-[#1a1a1a] px-4 py-2 rounded border border-gray-800">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-cyan-500 w-5 h-5"
      />
    </label>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | number
  options: (string | number)[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col text-gray-300 bg-[#1a1a1a] px-4 py-2 rounded border border-gray-800">
      <span className="mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0f0f0f] p-2 rounded border border-gray-700 text-gray-200"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="flex flex-col text-gray-300 bg-[#1a1a1a] px-4 py-2 rounded border border-gray-800">
      <span className="mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0f0f0f] p-2 rounded border border-gray-700 text-gray-200"
      />
    </label>
  )
}