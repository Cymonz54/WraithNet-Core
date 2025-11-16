"use client"

import { useApi } from "./useApi"

export function usePolicies() {
  return useApi("/policies")
}
