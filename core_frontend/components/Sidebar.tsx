"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Shield, AlertTriangle, Settings, Activity } from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Policies", icon: Shield, href: "/dashboard/policies" },
  { name: "Alerts", icon: AlertTriangle, href: "/dashboard/alerts" },
  { name: "System Health", icon: Activity, href: "/dashboard/system" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-[#0d0d0d] border-r border-gray-800 w-64 hidden md:flex flex-col p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-cyan-400 tracking-wide">WraithNet Core</h1>
        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition 
                ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-700"
                    : "text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
                }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-gray-800 pt-4 text-xs text-gray-600">
        © {new Date().getFullYear()} WraithNet Labs
      </div>
    </aside>
  )
}
