"use client"

import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, Activity, Shield, Settings } from "lucide-react"
import { SettingsProvider } from "@/context/SettingsContext"  // ✅ import your provider

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/policies", label: "Policies" },
    { href: "/alerts", label: "Alerts" },
  ]

  const sidebarLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/telemetry", label: "Telemetry", icon: Activity },
    { href: "/defense", label: "Proactive Defense", icon: Shield },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-gray-200 min-h-screen`}>
        {/* ✅ Wrap entire app in SettingsProvider */}
        <SettingsProvider>
          {/* Top Navigation Bar */}
          <header className="fixed top-0 left-0 w-full bg-[#111] border-b border-gray-800 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
              {/* Brand */}
              <Link
                href="/"
                className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                WraithNet<span className="text-gray-400">Core</span>
              </Link>

              {/* Desktop Nav */}
              <nav className="space-x-6 text-sm hidden md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:text-cyan-300 transition ${
                      pathname.startsWith(link.href)
                        ? "text-cyan-400 border-b border-cyan-400 pb-1"
                        : "text-gray-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-300 hover:text-cyan-400 transition"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </header>

          {/* Sidebar + Content */}
          <div className="flex pt-16">
            {/* Sidebar */}
            <aside
              className={`fixed md:static top-16 left-0 z-40 bg-[#121212] border-r border-gray-800 w-60 min-h-screen px-4 py-6 space-y-3 transform transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
              }`}
            >
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const active = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm transition ${
                      active
                        ? "text-cyan-400 bg-[#1a1a1a] font-medium"
                        : "text-gray-300 hover:text-cyan-300 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-500"}`} />
                    {link.label}
                  </Link>
                )
              })}
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 bg-[#0a0a0a] md:ml-60">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  )
}
