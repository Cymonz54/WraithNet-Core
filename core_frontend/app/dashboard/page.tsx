"use client"

import { useApi } from "../hooks/useApi"
import { Activity, Shield, Cpu, Server, AlertTriangle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface TelemetryPoint {
  time: string
  usage: number
}

interface TelemetryData {
  cpu: TelemetryPoint[]
  memory: TelemetryPoint[]
  uptime: string
  activeAgents: number
  alerts: number
}

export default function DashboardPage() {
  const { data, loading, error } = useApi<TelemetryData>("/telemetry/")

  // Fallback if API is not ready
  const mockData: TelemetryData = {
    cpu: Array.from({ length: 10 }).map((_, i) => ({
      time: `${i + 1}s`,
      usage: Math.floor(30 + Math.random() * 20),
    })),
    memory: Array.from({ length: 10 }).map((_, i) => ({
      time: `${i + 1}s`,
      usage: Math.floor(55 + Math.random() * 10),
    })),
    uptime: "5d 13h 42m",
    activeAgents: 7,
    alerts: 2,
  }

  const telemetry = data || mockData

  // Take the latest CPU and memory values for the cards
  const latestCpu = telemetry.cpu[telemetry.cpu.length - 1].usage
  const latestMemory = telemetry.memory[telemetry.memory.length - 1].usage

  // Prepare chart data
  const trendData = telemetry.cpu.map((point, i) => ({
    time: point.time,
    cpu: point.usage,
    memory: telemetry.memory[i]?.usage ?? 0,
  }))

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400">System Overview</h1>
        <p className="text-sm text-gray-400">
          Real-time monitoring and operational performance overview
        </p>
      </div>

      {/* Horizontal Rectangle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          icon={<Cpu className="w-6 h-6 text-cyan-400" />}
          label="CPU Usage"
          value={`${latestCpu}%`}
        />
        <StatusCard
          icon={<Server className="w-6 h-6 text-cyan-400" />}
          label="Memory Usage"
          value={`${latestMemory}%`}
        />
        <StatusCard
          icon={<Activity className="w-6 h-6 text-cyan-400" />}
          label="System Uptime"
          value={telemetry.uptime}
        />
        <StatusCard
          icon={<Shield className="w-6 h-6 text-cyan-400" />}
          label="Active Defense Agents"
          value={telemetry.activeAgents}
        />
        <StatusCard
          icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
          label="Active Alerts"
          value={telemetry.alerts}
        />
      </div>

      {/* Telemetry Trends */}
      <div className="bg-[#121212] border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-4">
          Resource Usage Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="time" stroke="#777" />
            <YAxis stroke="#777" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#aaa" }}
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#00ffff"
              strokeWidth={2}
              dot={false}
              name="CPU %"
            />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="#00ff99"
              strokeWidth={2}
              dot={false}
              name="Memory %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="bg-[#121212] border border-gray-800 p-6 rounded-lg flex items-center justify-between hover:border-cyan-500/50 transition min-h-[80px]">
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-xl font-semibold text-cyan-300 mt-1">{value}</p>
      </div>
      <div className="bg-[#0f0f0f] p-3 rounded-lg border border-gray-700 flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}
