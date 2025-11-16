"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Cpu, Server, Activity, Shield, AlertTriangle, Download } from "lucide-react"

interface TelemetryPoint {
  time: string
  usage: number
}

interface TelemetryData {
  cpu?: TelemetryPoint[]
  memory?: TelemetryPoint[]
  disk?: TelemetryPoint[]
  network?: TelemetryPoint[]
  uptime: string
  activeAgents: number
  alerts: number
  alertList?: { time: string; type: string; severity: string; description: string }[]
  agentList?: { name: string; cpu: number; memory: number; status: string; lastHeartbeat: string }[]
}

export default function TelemetryPage() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    cpu: [],
    memory: [],
    disk: [],
    network: [],
    uptime: "0d 0h 0m",
    activeAgents: 0,
    alerts: 0,
    alertList: [],
    agentList: [],
  })

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/telemetry/ws")

    ws.onopen = () => console.log("Connected to telemetry WebSocket")
    ws.onclose = () => console.log("Disconnected from telemetry WebSocket")
    ws.onerror = (err) => console.error("WebSocket error", err)

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setTelemetry(data)
      } catch (err) {
        console.error("Invalid telemetry data", err)
      }
    }

    return () => ws.close()
  }, [])

  const latestCpu = telemetry.cpu?.[telemetry.cpu.length - 1]?.usage ?? 0
  const latestMemory = telemetry.memory?.[telemetry.memory.length - 1]?.usage ?? 0
  const latestDisk = telemetry.disk?.[telemetry.disk.length - 1]?.usage ?? 0
  const latestNetwork = telemetry.network?.[telemetry.network.length - 1]?.usage ?? 0

  // Export telemetry JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(telemetry, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `telemetry_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400">Telemetry</h1>
        <p className="text-sm text-gray-400">
          Detailed system metrics and real-time performance monitoring
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard icon={<Cpu className="w-6 h-6 text-cyan-400" />} label="CPU Usage" value={`${latestCpu}%`} sparkData={telemetry.cpu} />
        <StatusCard icon={<Server className="w-6 h-6 text-cyan-400" />} label="Memory Usage" value={`${latestMemory}%`} sparkData={telemetry.memory} />
        <StatusCard icon={<Activity className="w-6 h-6 text-cyan-400" />} label="Disk Usage" value={`${latestDisk}%`} sparkData={telemetry.disk} />
        <StatusCard icon={<Activity className="w-6 h-6 text-cyan-400" />} label="Network Usage" value={`${latestNetwork} Mbps`} sparkData={telemetry.network} />
        <StatusCard icon={<Activity className="w-6 h-6 text-cyan-400" />} label="System Uptime" value={telemetry.uptime} />
        <StatusCard icon={<Shield className="w-6 h-6 text-cyan-400" />} label="Active Agents" value={telemetry.activeAgents} />
        <StatusCard icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />} label="Active Alerts" value={telemetry.alerts} />
      </div>

      {/* Trend Charts */}
      <TrendChart title="CPU & Memory Trends" data={telemetry.cpu} compareData={telemetry.memory} lineKeys={["cpu", "memory"]} colors={["#00ffff", "#00ff99"]} />
      <TrendChart title="Disk & Network Trends" data={telemetry.disk} compareData={telemetry.network} lineKeys={["disk", "network"]} colors={["#ff9900", "#ff33cc"]} />

      {/* Recent Alerts & Active Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Table */}
        <div className="bg-[#121212] border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-cyan-400">Recent Alerts</h2>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 text-sm bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded"
            >
              <Download className="w-4 h-4" /> Export Data
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b border-gray-700">Time</th>
                  <th className="px-3 py-2 border-b border-gray-700">Type</th>
                  <th className="px-3 py-2 border-b border-gray-700">Severity</th>
                  <th className="px-3 py-2 border-b border-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.alertList && telemetry.alertList.length > 0 ? (
                  telemetry.alertList.map((alert, i) => (
                    <tr key={i} className="hover:bg-[#1a1a1a]">
                      <td className="px-3 py-2">{alert.time}</td>
                      <td className="px-3 py-2">{alert.type}</td>
                      <td className="px-3 py-2">{alert.severity}</td>
                      <td className="px-3 py-2">{alert.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-3 py-2 text-gray-400 text-center">
                      No alerts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Agents Table */}
        <div className="bg-[#121212] border border-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Active Agents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b border-gray-700">Name</th>
                  <th className="px-3 py-2 border-b border-gray-700">CPU</th>
                  <th className="px-3 py-2 border-b border-gray-700">Memory</th>
                  <th className="px-3 py-2 border-b border-gray-700">Status</th>
                  <th className="px-3 py-2 border-b border-gray-700">Last Heartbeat</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.agentList && telemetry.agentList.length > 0 ? (
                  telemetry.agentList.map((agent, i) => (
                    <tr key={i} className="hover:bg-[#1a1a1a]">
                      <td className="px-3 py-2">{agent.name}</td>
                      <td className="px-3 py-2">{agent.cpu}%</td>
                      <td className="px-3 py-2">{agent.memory}%</td>
                      <td className="px-3 py-2">{agent.status}</td>
                      <td className="px-3 py-2">{agent.lastHeartbeat}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-gray-400 text-center">
                      No agents online
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Reusable Components ---
function StatusCard({
  icon,
  label,
  value,
  sparkData,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sparkData?: TelemetryPoint[]
}) {
  return (
    <div className="bg-[#121212] border border-gray-800 p-4 rounded-lg flex flex-col justify-between hover:border-cyan-500/50 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-xl font-semibold text-cyan-300 mt-1">{value}</p>
        </div>
        <div className="bg-[#0f0f0f] p-3 rounded-full border border-gray-700">{icon}</div>
      </div>
      {sparkData && sparkData.length > 1 && (
        <ResponsiveContainer width="100%" height={30} className="mt-2">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="usage" stroke="#00ffff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function TrendChart({
  title,
  data,
  compareData,
  lineKeys,
  colors,
}: {
  title: string
  data?: TelemetryPoint[]
  compareData?: TelemetryPoint[]
  lineKeys: string[]
  colors: string[]
}) {
  const chartData = data?.map((d, i) => ({
    time: d.time,
    [lineKeys[0]]: d.usage,
    [lineKeys[1]]: compareData?.[i]?.usage ?? 0,
  }))

  return (
    <div className="bg-[#121212] border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
          <XAxis dataKey="time" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#aaa" }}
          />
          <Line type="monotone" dataKey={lineKeys[0]} stroke={colors[0]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey={lineKeys[1]} stroke={colors[1]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
