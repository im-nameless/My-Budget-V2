"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { DashboardData } from "@/types/api"

export function useDashboard(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const dashboardData = await apiClient.getDashboardData(startDate?.toISOString(), endDate?.toISOString())
      setData(dashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [startDate, endDate])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  }
}
