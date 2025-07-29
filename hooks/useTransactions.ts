"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { Transaction, TransactionInput } from "@/types/api"

export function useTransactions(filters?: {
  startDate?: Date
  endDate?: Date
  category?: string
  type?: "income" | "expense"
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        startDate: filters?.startDate?.toISOString(),
        endDate: filters?.endDate?.toISOString(),
        category: filters?.category,
        type: filters?.type,
      }

      const data = await apiClient.getTransactions(params)
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  const createTransaction = async (transaction: TransactionInput) => {
    try {
      const newTransaction = await apiClient.createTransaction(transaction)
      setTransactions((prev) => [newTransaction, ...prev])
      return newTransaction
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create transaction")
    }
  }

  const updateTransaction = async (id: string, updates: Partial<TransactionInput>) => {
    try {
      const updatedTransaction = await apiClient.updateTransaction(id, updates)
      setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTransaction : t)))
      return updatedTransaction
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update transaction")
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await apiClient.deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete transaction")
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [filters?.startDate, filters?.endDate, filters?.category, filters?.type])

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}
