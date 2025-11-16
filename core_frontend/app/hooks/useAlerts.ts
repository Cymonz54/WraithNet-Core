"use client"

import { useApi } from "./useApi"

export function useAlerts() {
  return useApi("/alerts")
}
