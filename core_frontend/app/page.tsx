"use client"

import { useEffect, useState } from "react"
import { Activity, AlertTriangle, ShieldCheck, Server, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const [eventsToday, setEventsToday] = useState(0)
  const [activePolicies, setActivePolicies] = useState(0)
  const [alerts, setAlerts] = useState(0)
  const [systemStatus, setSystemStatus] = useState("Healthy")

  // Simulate API data fetch (replace later with real API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setEventsToday(187)
      setActivePolicies(14)
      setAlerts(3)
      setSystemStatus("Operational")
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-cyan-400">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Monitor WraithNet telemetry, policy activity, and security alerts in real time.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Activity />} label="Events Today" value={eventsToday.toString()} color="text-cyan-400" />
        <StatCard icon={<ShieldCheck />} label="Active Policies" value={activePolicies.toString()} color="text-green-400" />
        <StatCard icon={<AlertTriangle />} label="Active Alerts" value={alerts.toString()} color="text-yellow-400" />
        <StatCard icon={<Server />} label="System Status" value={systemStatus} color="text-blue-400" />
      </div>

      {/* Graph Section */}
      <div className="bg-[#111] rounded-xl border border-gray-800 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-medium text-gray-200">Event Trends (Mock Data)</h2>
        </div>
        <MockGraph />
      </div>
    </div>
  )
}

// Reusable Stat Card
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-[#121212] border border-gray-800 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:border-cyan-700 transition">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md bg-[#1a1a1a] ${color}`}>{icon}</div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className={`mt-3 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  )
}

// Mock graph placeholder
function MockGraph() {
  const bars = [40, 65, 80, 55, 70, 90, 50]
  return (
    <div className="flex items-end gap-3 h-32">
      {bars.map((height, i) => (
        <div
          key={i}
          style={{ height: `${height}%` }}
          className="w-6 bg-cyan-500/40 rounded-sm hover:bg-cyan-400 transition"
        />
      ))}
    </div>
  )
}
