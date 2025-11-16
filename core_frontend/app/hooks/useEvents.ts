"use client"

import { useApi } from "./useApi"

export function useEvents() {
  return useApi("/events")
}
