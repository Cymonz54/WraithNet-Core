"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export function useApi<T = unknown>(
  endpoint: string,
  autoFetch: boolean = true,
  opts: RequestInit = {},
  refreshMs?: number // optional refresh interval in milliseconds
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(autoFetch)
  const [error, setError] = useState<string | null>(null)

  // Keep a stable reference to avoid stale closures
  const optsRef = useRef(opts)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("access_token") : null

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(optsRef.current.headers as Record<string, string>) || {},
      }

      if (token) headers["Authorization"] = `Bearer ${token}`

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...optsRef.current,
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized - please login")
        throw new Error(`Error ${response.status}`)
      }

      const json: T = await response.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  // Run once or on endpoint change
  useEffect(() => {
    if (autoFetch) fetchData()
  }, [autoFetch, endpoint, fetchData])

  // Auto-refresh feature (smooth updates)
  useEffect(() => {
    if (!refreshMs) return
    const interval = setInterval(fetchData, refreshMs)
    return () => clearInterval(interval)
  }, [fetchData, refreshMs])

  return { data, loading, error, refetch: fetchData }
}
