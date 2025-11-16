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
import {
  Shield,
  Activity,
  AlertTriangle,
  Cpu,
  Server,
  CheckCircle,
  XCircle,
} from "lucide-react"

// --- Types ---
interface TrendPoint {
  time: string
  value: number
}

interface DefenseSummary {
  activeRules: number
  threatsDetected: number
  mitigatedThreats: number
  failedMitigations: number
  activeAgents: number
  systemHealth: number
  trends: {
    activeRules: TrendPoint[]
    threatsDetected: TrendPoint[]
    mitigatedThreats: TrendPoint[]
    failedMitigations: TrendPoint[]
    activeAgents: TrendPoint[]
    systemHealth: TrendPoint[]
  }
}

interface DefenseRule {
  id: string
  name: string
  type: string
  status: "Enabled" | "Disabled"
  lastTriggered: string
}

interface Threat {
  time: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  source: string
  action: string
}

interface Agent {
  name: string
  cpu: number
  memory: number
  status: "Online" | "Offline"
  lastHeartbeat: string
}

interface MitigationLog {
  time: string
  threatType: string
  action: string
  outcome: "Success" | "Failure"
}

// --- Main Page ---
export default function ProactiveDefensePage() {
  const [summary, setSummary] = useState<DefenseSummary>({
    activeRules: 12,
    threatsDetected: 8,
    mitigatedThreats: 6,
    failedMitigations: 2,
    activeAgents: 5,
    systemHealth: 87,
    trends: {
      activeRules: [
        { time: "10:00", value: 10 },
        { time: "11:00", value: 11 },
        { time: "12:00", value: 12 },
      ],
      threatsDetected: [
        { time: "10:00", value: 4 },
        { time: "11:00", value: 6 },
        { time: "12:00", value: 8 },
      ],
      mitigatedThreats: [
        { time: "10:00", value: 2 },
        { time: "11:00", value: 4 },
        { time: "12:00", value: 6 },
      ],
      failedMitigations: [
        { time: "10:00", value: 1 },
        { time: "11:00", value: 1 },
        { time: "12:00", value: 2 },
      ],
      activeAgents: [
        { time: "10:00", value: 4 },
        { time: "11:00", value: 5 },
        { time: "12:00", value: 5 },
      ],
      systemHealth: [
        { time: "10:00", value: 85 },
        { time: "11:00", value: 86 },
        { time: "12:00", value: 87 },
      ],
    },
  })

  const [rules, setRules] = useState<DefenseRule[]>([
    { id: "1", name: "Firewall Block Port 80", type: "Firewall", status: "Enabled", lastTriggered: "2025-10-14 12:12:01" },
    { id: "2", name: "Malware Scan Daily", type: "Malware Scan", status: "Enabled", lastTriggered: "2025-10-14 06:00:00" },
    { id: "3", name: "Anomaly Detection", type: "Anomaly Detection", status: "Disabled", lastTriggered: "2025-10-13 18:45:23" },
  ])

  const [threats, setThreats] = useState<Threat[]>([
    { time: "12:34:56", type: "CPU Spike", severity: "High", source: "192.168.0.12", action: "Mitigated" },
    { time: "12:35:01", type: "Memory Warning", severity: "Medium", source: "192.168.0.15", action: "Mitigated" },
  ])

  const [agents, setAgents] = useState<Agent[]>([
    { name: "Agent-01", cpu: 34, memory: 62, status: "Online", lastHeartbeat: "12:40:12" },
    { name: "Agent-02", cpu: 20, memory: 40, status: "Offline", lastHeartbeat: "11:50:00" },
  ])

  const [logs, setLogs] = useState<MitigationLog[]>([
    { time: "12:34:56", threatType: "CPU Spike", action: "Throttle Process", outcome: "Success" },
    { time: "12:35:01", threatType: "Memory Warning", action: "Kill Process", outcome: "Success" },
  ])

  const [cpuTrend, setCpuTrend] = useState<TrendPoint[]>([
    { time: "12:30", value: 30 },
    { time: "12:31", value: 45 },
    { time: "12:32", value: 40 },
    { time: "12:33", value: 60 },
    { time: "12:34", value: 50 },
  ])

  const [threatTrend, setThreatTrend] = useState<TrendPoint[]>([
    { time: "10:00", value: 1 },
    { time: "11:00", value: 3 },
    { time: "12:00", value: 2 },
    { time: "13:00", value: 4 },
  ])

  // --- WebSocket / Live Updates Placeholder ---
  useEffect(() => {
    // Connect to backend WebSocket for live updates if needed
  }, [])

  return (
    <div className="space-y-6">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400">Proactive Defense</h1>
        <p className="text-sm text-gray-400">Monitor, manage, and respond to potential threats in real-time</p>
      </div>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <SummaryCard label="Active Defense Rules" value={summary.activeRules} icon={<Shield className="w-6 h-6 text-cyan-400" />} sparkData={summary.trends.activeRules} sparkColor="#00ffff" />
        <SummaryCard label="Threats Detected" value={summary.threatsDetected} icon={<AlertTriangle className="w-6 h-6 text-red-400" />} sparkData={summary.trends.threatsDetected} sparkColor="#ff5555" />
        <SummaryCard label="Mitigated Threats" value={summary.mitigatedThreats} icon={<CheckCircle className="w-6 h-6 text-green-400" />} sparkData={summary.trends.mitigatedThreats} sparkColor="#00ff00" />
        <SummaryCard label="Failed Mitigations" value={summary.failedMitigations} icon={<XCircle className="w-6 h-6 text-red-600" />} sparkData={summary.trends.failedMitigations} sparkColor="#ff0000" />
        <SummaryCard label="Active Agents" value={summary.activeAgents} icon={<Activity className="w-6 h-6 text-cyan-400" />} sparkData={summary.trends.activeAgents} sparkColor="#00ffff" />
        <SummaryCard label="System Health" value={`${summary.systemHealth}%`} icon={<Server className="w-6 h-6 text-cyan-400" />} sparkData={summary.trends.systemHealth} sparkColor="#00ff99" />
      </div>

      {/* --- Defense Rules Table --- */}
      <Section title="Defense Rules Management">
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-800 rounded-lg">
            <thead>
              <tr className="bg-[#111]">
                <th className="p-3">Rule Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Triggered</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-t border-gray-800">
                  <td className="p-3">{rule.name}</td>
                  <td className="p-3">{rule.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${rule.status === "Enabled" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-200"}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="p-3">{rule.lastTriggered}</td>
                  <td className="p-3 space-x-2">
                    <button className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm">Edit</button>
                    <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">{rule.status === "Enabled" ? "Disable" : "Enable"}</button>
                    <button className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* --- Threats Overview --- */}
      <Section title="Threats Overview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-800 rounded-lg">
              <thead>
                <tr className="bg-[#111]">
                  <th className="p-3">Time Detected</th>
                  <th className="p-3">Threat Type</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((t, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="p-3">{t.time}</td>
                    <td className="p-3">{t.type}</td>
                    <td className={`p-3 font-semibold ${t.severity === "High" ? "text-red-500" : t.severity === "Critical" ? "text-red-700" : "text-yellow-400"}`}>
                      {t.severity}
                    </td>
                    <td className="p-3">{t.source}</td>
                    <td className="p-3">{t.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* --- Agents Table --- */}
      {/* --- Active Agents --- */}
<Section title="Active Agents">
  <div className="overflow-x-auto">
    <table className="w-full text-left border border-gray-800 rounded-lg">
      <thead>
        <tr className="bg-[#111]">
          <th className="p-3">Name</th>
          <th className="p-3">CPU</th>
          <th className="p-3">Memory</th>
          <th className="p-3">Status</th>
          <th className="p-3">Last Heartbeat</th>
        </tr>
      </thead>
      <tbody>
        {agents.length > 0 ? (
          agents.map((a, i) => (
            <tr key={i} className="border-t border-gray-800">
              <td className="p-3">{a.name}</td>
              <td className="p-3">{a.cpu}%</td>
              <td className="p-3">{a.memory}%</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    a.status === "Online" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="p-3">{a.lastHeartbeat}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-3 text-center text-gray-400" colSpan={5}>
              No agents online
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</Section>


      {/* --- Mitigation Logs --- */}
      <Section title="Automated Mitigation Logs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-800 rounded-lg">
            <thead>
              <tr className="bg-[#111]">
                <th className="p-3">Time</th>
                <th className="p-3">Threat Type</th>
                <th className="p-3">Action Taken</th>
                <th className="p-3">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="p-3">{log.time}</td>
                  <td className="p-3">{log.threatType}</td>
                  <td className="p-3">{log.action}</td>
                  <td className={`p-3 font-semibold ${log.outcome === "Success" ? "text-green-500" : "text-red-500"}`}>
                    {log.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* --- Threat Trends Chart --- */}
      <Section title="Threats Trend Over Time">
        <div className="bg-[#121212] border border-gray-800 rounded-lg p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={threatTrend}>
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
              <Line type="monotone" dataKey="value" stroke="#ff5555" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
      {/* --- Export Buttons --- */}
<div className="flex space-x-2 mb-4">
  <button
    onClick={() => exportToJSON(rules, "defense-rules.json")}
    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
  >
    Export JSON
  </button>
  <button
    onClick={() => exportToCSV(rules, "defense-rules.csv")}
    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
  >
    Export CSV
  </button>
</div>
    </div>
    
  )
}


// --- Reusable Components ---
// Export JSON
function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Export CSV
function exportToCSV(data: any[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(",")]
  data.forEach((row) => {
    const values = headers.map((h) => `"${row[h]}"`)
    csvRows.push(values.join(","))
  })
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function SummaryCard({
  label,
  value,
  icon,
  sparkData,
  sparkColor,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  sparkData?: TrendPoint[]
  sparkColor?: string
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
            <Line type="monotone" dataKey="value" stroke={sparkColor || "#00ffff"} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-cyan-400">{title}</h2>
      {children}
    </div>
  )
}

