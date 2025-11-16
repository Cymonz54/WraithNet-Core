"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append("username", username)
      params.append("password", password)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Login failed: ${res.status}`)
      }

      const data: { access_token: string; refresh_token: string } = await res.json()

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)

      router.push("/dashboard")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto bg-[#0f0f0f] p-6 rounded-lg border border-gray-800">
      <h2 className="text-lg font-semibold text-cyan-400 mb-4">Sign in</h2>
      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
      <label className="block mb-2">
        <span className="text-sm text-gray-300">Username</span>
        <input
          className="mt-1 w-full rounded px-3 py-2 bg-[#111] border border-gray-700 text-gray-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="block mb-4">
        <span className="text-sm text-gray-300">Password</span>
        <input
          type="password"
          className="mt-1 w-full rounded px-3 py-2 bg-[#111] border border-gray-700 text-gray-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button
        disabled={loading}
        className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
