"use client"

import type { Transaction, TransactionInput, DashboardData } from "@/types/api"
import { cookies } from "next/headers"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// API Client with error handling
class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = (await cookies()).get('auth-token')?.value;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Transaction endpoints
  async getTransactions(params?: {
    startDate?: string
    endDate?: string
    category?: string
    type?: "income" | "expense"
  }): Promise<Transaction[]> {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append("startDate", params.startDate)
    if (params?.endDate) searchParams.append("endDate", params.endDate)
    if (params?.category) searchParams.append("category", params.category)
    if (params?.type) searchParams.append("type", params.type)

    const query = searchParams.toString()
    return this.request<Transaction[]>(`/transactions${query ? `?${query}` : ""}`)
  }

  async createTransaction(transaction: TransactionInput): Promise<Transaction> {
    return this.request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    })
  }

  async updateTransaction(id: string, transaction: Partial<TransactionInput>): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    })
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.request<void>(`/transactions/${id}`, {
      method: "DELETE",
    })
  }

  // Dashboard data
  async getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    const query = params.toString()
    return this.request<DashboardData>(`/dashboard${query ? `?${query}` : ""}`)
  }

  // Recurring transactions
  async getRecurringTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>("/transactions/recurring")
  }

  async processRecurringTransactions(): Promise<{ processed: number; created: Transaction[] }> {
    return this.request("/transactions/recurring/process", {
      method: "POST",
    })
  }

  // Categories
  async getCategories(): Promise<{ income: string[]; expense: string[] }> {
    return this.request<{ income: string[]; expense: string[] }>("/categories")
  }

  // User preferences
  async updateUserPreferences(preferences: {
    currency?: string
    language?: string
    theme?: string
  }): Promise<void> {
    return this.request("/user/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    })
  }
}

export const apiClient = new ApiClient()
