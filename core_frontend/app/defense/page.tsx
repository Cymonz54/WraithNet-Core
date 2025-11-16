"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  AlertTriangle,
  HardDrive,
  Network,
  Activity,
  Download,
  RefreshCw,
  Plus,
  Search,
  Settings,
  Trash2,
  Play,
  Pause,
  Edit3,
} from "lucide-react"

// --- Type Definitions ---
interface DefenseSummary {
  totalThreats: number
  blockedAttacks: number
  activeAgents: number
  systemHealth: number
}

interface DefenseRule {
  id: string
  name: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  action: "block" | "alert" | "quarantine"
  lastTriggered: string
}

interface ThreatDetection {
  id: string
  timestamp: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  status: "active" | "blocked" | "investigating"
  description: string
}

interface AgentStatus {
  id: string
  name: string
  status: "online" | "offline" | "warning"
  cpu: number
  memory: number
  lastSeen: string
  threatsBlocked: number
}

interface SystemLog {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  component: string
  message: string
}

// --- Export Functions ---
function exportToJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(",")]
  data.forEach((row) => {
    const values = headers.map((h) => `"${String(row[h] ?? '')}"`)
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

// --- Sub-components ---
function SummaryCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
}) {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{trend}</p>
        </div>
        <div className="p-2 bg-gray-800 rounded-lg">{icon}</div>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Threat Trends</h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            Threat trend visualization chart
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">System Health</h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            System health monitoring chart
          </div>
        </div>
      </div>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Recent Activity</h3>
        <div className="text-gray-500 text-center py-8">
          Recent security events and activities will appear here
        </div>
      </div>
    </div>
  )
}

function RulesTab({
  rules,
  onRuleToggle,
}: {
  rules: DefenseRule[]
  onRuleToggle: (ruleId: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cyan-400">Defense Rules</h3>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>
      <div className="space-y-3">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-white">{rule.name}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      rule.severity === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : rule.severity === "high"
                        ? "bg-orange-500/20 text-orange-400"
                        : rule.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {rule.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{rule.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Action: {rule.action}</span>
                  <span>Last triggered: {new Date(rule.lastTriggered).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRuleToggle(rule.id)}
                  className={`p-2 rounded ${
                    rule.enabled
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                  }`}
                >
                  {rule.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ThreatsTab({
  threats,
  searchTerm,
  severityFilter,
  onSearchChange,
  onSeverityFilterChange,
  onThreatAction,
}: {
  threats: ThreatDetection[]
  searchTerm: string
  severityFilter: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSeverityFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onThreatAction: (threatId: string, action: "block" | "investigate" | "dismiss") => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cyan-400">Threat Detection</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search threats..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded text-white placeholder-gray-400"
            />
          </div>
          <select
            value={severityFilter}
            onChange={onSeverityFilterChange}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded text-white"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="space-y-3">
        {threats.map(threat => (
          <div
            key={threat.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-white">{threat.type}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      threat.severity === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : threat.severity === "high"
                        ? "bg-orange-500/20 text-orange-400"
                        : threat.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {threat.severity.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      threat.status === "blocked"
                        ? "bg-green-500/20 text-green-400"
                        : threat.status === "investigating"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {threat.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{threat.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Source: {threat.source}</span>
                  <span>Target: {threat.target}</span>
                  <span>Time: {new Date(threat.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {threat.status === "active" && (
                  <>
                    <button
                      onClick={() => onThreatAction(threat.id, "block")}
                      className="px-3 py-1 bg-red-500 hover:bg-red-400 rounded text-white text-sm"
                    >
                      Block
                    </button>
                    <button
                      onClick={() => onThreatAction(threat.id, "investigate")}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 rounded text-white text-sm"
                    >
                      Investigate
                    </button>
                  </>
                )}
                <button
                  onClick={() => onThreatAction(threat.id, "dismiss")}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded text-white text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentsTab({ agents }: { agents: AgentStatus[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cyan-400">Agent Status</h3>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white flex items-center gap-2">
          <Settings className="w-4 h-4" /> Manage Agents
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">{agent.name}</h4>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      agent.status === "online"
                        ? "bg-green-500"
                        : agent.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">CPU Usage:</span>
                    <span className="text-white">{agent.cpu}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Memory Usage:</span>
                    <span className="text-white">{agent.memory}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Threats Blocked:</span>
                    <span className="text-white">{agent.threatsBlocked}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Seen:</span>
                    <span className="text-white">
                      {new Date(agent.lastSeen).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded bg-gray-700 hover:bg-gray-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogsTab({
  logs,
  searchTerm,
  onSearchChange,
}: {
  logs: SystemLog[]
  searchTerm: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cyan-400">System Logs</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded text-white placeholder-gray-400"
            />
          </div>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {logs.map(log => (
          <div
            key={log.id}
            className="flex items-center gap-4 p-3 bg-[#1a1a1a] border border-gray-800 rounded"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                log.level === "error"
                  ? "bg-red-500"
                  : log.level === "warning"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            ></span>
            <span className="text-xs text-gray-400 w-20">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-sm text-cyan-400 w-32">{log.component}</span>
            <span className="text-sm text-white flex-1">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main Component ---
export default function DefensePage() {
  const [summary, setSummary] = useState<DefenseSummary>({
    totalThreats: 0,
    blockedAttacks: 0,
    activeAgents: 0,
    systemHealth: 100,
  })

  const [rules, setRules] = useState<DefenseRule[]>([])
  const [threats, setThreats] = useState<ThreatDetection[]>([])
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [logs, setLogs] = useState<SystemLog[]>([])

  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "threats" | "agents" | "logs">("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<"all" | "low" | "medium" | "high" | "critical">("all")
  const [isLoading, setIsLoading] = useState(true)

  // Load mock data
  useEffect(() => {
    loadMockData()
    const interval = setInterval(updateLiveData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadMockData = () => {
    setSummary({
      totalThreats: 142,
      blockedAttacks: 138,
      activeAgents: 8,
      systemHealth: 94,
    })

    setRules([
      {
        id: "1",
        name: "SQL Injection Block",
        description: "Blocks SQL injection attempts in web requests",
        severity: "high",
        enabled: true,
        action: "block",
        lastTriggered: "2024-01-15T14:30:00Z",
      },
      {
        id: "2",
        name: "XSS Protection",
        description: "Detects and prevents cross-site scripting attacks",
        severity: "high",
        enabled: true,
        action: "block",
        lastTriggered: "2024-01-15T13:45:00Z",
      },
    ])

    setThreats([
      {
        id: "1",
        timestamp: "2024-01-15T14:30:00Z",
        type: "SQL Injection",
        severity: "high",
        source: "192.168.1.100",
        target: "Web Server",
        status: "blocked",
        description: "SQL injection attempt detected in login form",
      },
    ])

    setAgents([
      {
        id: "1",
        name: "Web Server Agent",
        status: "online",
        cpu: 45,
        memory: 62,
        lastSeen: "2024-01-15T14:35:00Z",
        threatsBlocked: 42,
      },
    ])

    setLogs([
      {
        id: "1",
        timestamp: "2024-01-15T14:35:00Z",
        level: "info",
        component: "Defense Engine",
        message: "Threat database updated successfully",
      },
    ])

    setIsLoading(false)
  }

  const updateLiveData = () => {
    setSummary(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + Math.floor(Math.random() * 3),
      blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 2),
    }))
  }

  const handleRuleToggle = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const handleThreatAction = (threatId: string, action: "block" | "investigate" | "dismiss") => {
    setThreats(prev => prev.map(threat =>
      threat.id === threatId ? { ...threat, status: action === "block" ? "blocked" : "investigating" } : threat
    ))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSeverityFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeverityFilter(event.target.value as "all" | "low" | "medium" | "high" | "critical")
  }

  const handleExportJSON = () => {
    exportToJSON(rules, "defense-rules.json")
  }

  const handleExportCSV = () => {
    // Convert DefenseRule to Record<string, unknown> for CSV export
    const rulesForCSV: Record<string, unknown>[] = rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      severity: rule.severity,
      enabled: rule.enabled,
      action: rule.action,
      lastTriggered: rule.lastTriggered,
    }))
    exportToCSV(rulesForCSV, "defense-rules.csv")
  }

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || threat.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.component.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <Shield className="w-6 h-6" /> Proactive Defense
          </h1>
          <p className="text-sm text-gray-400">
            Monitor, detect, and respond to security threats in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={handleExportJSON}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Threats"
          value={summary.totalThreats.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          trend="+2 today"
        />
        <SummaryCard
          title="Blocked Attacks"
          value={summary.blockedAttacks.toString()}
          icon={<Shield className="w-5 h-5 text-green-400" />}
          trend="98.5% success rate"
        />
        <SummaryCard
          title="Active Agents"
          value={summary.activeAgents.toString()}
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          trend="All systems operational"
        />
        <SummaryCard
          title="System Health"
          value={`${summary.systemHealth}%`}
          icon={<Shield className="w-5 h-5 text-cyan-400" />}
          trend="Optimal"
        />
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleExportJSON}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
        >
          Export JSON
        </button>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "overview", name: "Overview", icon: Activity },
            { id: "rules", name: "Defense Rules", icon: Shield },
            { id: "threats", name: "Threat Detection", icon: AlertTriangle },
            { id: "agents", name: "Agents", icon: Network },
            { id: "logs", name: "System Logs", icon: HardDrive },
          ].map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === id
                  ? "border-cyan-500 text-cyan-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "rules" && (
          <RulesTab rules={rules} onRuleToggle={handleRuleToggle} />
        )}
        {activeTab === "threats" && (
          <ThreatsTab
            threats={filteredThreats}
            searchTerm={searchTerm}
            severityFilter={severityFilter}
            onSearchChange={handleSearchChange}
            onSeverityFilterChange={handleSeverityFilterChange}
            onThreatAction={handleThreatAction}
          />
        )}
        {activeTab === "agents" && <AgentsTab agents={agents} />}
        {activeTab === "logs" && (
          <LogsTab logs={filteredLogs} searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        )}
      </div>
    </div>
  )
}